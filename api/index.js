const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const axios = require('axios'); // Import axios here
const { PythonShell } = require('python-shell');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://nandha:root@cluster0.i6eume2.mongodb.net/');

async function predictCategory(inputData) {
  try {
    const response = await axios.post('http://127.0.0.1:8000/predict', {
      data: inputData
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}



app.post('/register', async (req, res) => {
  const { username, password, preferences } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({
      username,
      password: hashedPassword,
      preferences // Save preferences array directly
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    try {
      const category = await predictCategory(content); // Wait for the category prediction
      const postDoc = await Post.create({
        title,
        summary,
        content,
        category,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing the post' });
    }
  });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    try {
      const category = await predictCategory(content); // Wait for the category prediction
      await postDoc.update({
        title,
        summary,
        content,
        category,
        cover: newPath ? newPath : postDoc.cover,
      });
      res.json(postDoc);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while updating the post' });
    }
  });
});


app.get('/post/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  try {
    // Retrieve user preferences from the database
    const user = await User.findById(userId);
    const userPreferences = user.preferences; // Assuming preferences are stored in a field named 'preferences'

    // Fetch posts based on user preferences
    const posts = await Post.find({
      category: { $in: userPreferences.map(preference => new RegExp(preference, 'i')) } // Case-insensitive matching
    }).populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);

    // Extracting only necessary fields and formatting the response
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      summary: post.summary,
      cover: post.cover,
      content: post.content,
      createdAt: post.createdAt,
      author: post.author,
      category: post.category,
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching posts' });
  }
});



app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);

    // Extracting only necessary fields and formatting the response
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      summary: post.summary,
      cover: post.cover,
      content: post.content,
      createdAt: post.createdAt,
      author: post.author,
      category: post.category,
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching posts' });
  }
});

app.get('/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(postDoc);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the post' });
  }
});

app.post('/blog/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    post.comments.push({ content });
    await post.save();
    res.status(201).json(post.comments);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while adding the comment' });
  }
});

app.post('/blog/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    post.likes++;
    await post.save();
    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while liking the post' });
  }
});


app.listen(4000);
