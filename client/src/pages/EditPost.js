// EditPost.js

import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/blog/' + id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
          setPreviewImage(postInfo.image); // Set preview image if available
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch('http://localhost:4000/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/' + id} />
  }

  return (
    <form className="edit-post-form" onSubmit={updatePost}>
      <div className="input-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
        />
      </div>
      <div className="file-input-container">
        <input
          type="file"
          onChange={(ev) => {
            setFiles(ev.target.files);
            if (ev.target.files && ev.target.files[0]) {
              let reader = new FileReader();
              reader.onload = (e) => {
                setPreviewImage(e.target.result);
              };
              reader.readAsDataURL(ev.target.files[0]);
            }
          }}
        />
        {previewImage && <img className="preview-image" src={previewImage} alt="Preview" />}
      </div>
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}>Update post</button>
    </form>
  );
}
