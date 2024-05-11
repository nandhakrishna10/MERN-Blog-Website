import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // Define previewImage state

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="create-post-form" onSubmit={createNewPost}>
  <input
    type="text"
    placeholder="Title"
    value={title}
    onChange={(ev) => setTitle(ev.target.value)}
  />
  <input
    type="text"
    placeholder="Summary"
    value={summary}
    onChange={(ev) => setSummary(ev.target.value)}
  />
  <div className="file-input-container">
    <label htmlFor="file-input" className="choose-file-button">Choose File</label>
    <input
      type="file"
      id="file-input"
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
    {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
  </div>
  <Editor value={content} onChange={setContent} />
  <button style={{ marginTop: "5px" }}>Create post</button>
</form>


  );
}
