import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.css";

export default function Editor({ value, onChange }) {
  const [tooltip, setTooltip] = useState(""); // State to manage tooltip text

  // Function to handle mouse over event on toolbar items
  const handleMouseOver = (e) => {
    const title = e.target.getAttribute("title");
    if (title) {
      setTooltip(title); // Update tooltip text
    }
  };

  // Function to handle mouse leave event on toolbar items
  const handleMouseLeave = () => {
    setTooltip(""); // Clear tooltip text
  };

  const modules = {
    toolbar: [
      [
        { header: [1, 2, false] },
        { font: [] },
        { align: [] },
        { size: ["small", false, "large", "huge"] },
      ],
      [
        "bold",
        "italic",
        "underline",
        "strike",
        { script: "sub" },
        { script: "super" },
      ],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="content">
      {/* Display tooltip */}
      {tooltip && <div className="tooltip">{tooltip}</div>}
      <ReactQuill
        value={value}
        theme="snow"
        onChange={onChange}
        modules={modules}
        // Handle mouse over and mouse leave events on toolbar items
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
