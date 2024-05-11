import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import './Post.css'; // Import your custom CSS file for styling

export default function Post({_id, title, summary, cover, content, createdAt, author, category}) {
  // Function to format category names
  const formatCategory = (category) => {
    switch (category) {
      case "WORLD":
        return "World";
      case "SPORTS":
        return "Sports";
      case "BUSINESS":
        return "Business";
      case "SCI":
        return "Science/Technology";
      default:
        return category;
    }
  };

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`http://localhost:4000/${cover}`} alt=""/>
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
        <div className="category">{formatCategory(category)}</div> {/* Apply custom styling to category */}
      </div>
    </div>
  );
}
