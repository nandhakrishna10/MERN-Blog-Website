const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const PostSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  category: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ content: String, createdAt: { type: Date, default: Date.now } }],
  likes: { type: Number, default: 0 }
}, {
  timestamps: true,
});


const PostModel = model('Post', PostSchema);

module.exports = PostModel;