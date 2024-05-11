import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link} from 'react-router-dom';

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();


  useEffect(() => {
    fetch(`http://localhost:4000/blog/${id}`)
      .then(response => response.json())
      .then(postInfo => setPostInfo(postInfo))
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/blog/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: commentContent })
      });
      if (response.ok) {
        const updatedPostInfo = await response.json();
        setPostInfo(prevPostInfo => ({ ...prevPostInfo, comments: updatedPostInfo }));
        setCommentContent('');
      } else {
        console.error('Failed to add comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:4000/blog/${id}/like`, {
        method: 'POST'
      });
      if (response.ok) {
        // Refresh post info after liking
        const updatedPostInfo = await response.json();
        setPostInfo(prevPostInfo => ({ ...prevPostInfo, likes: updatedPostInfo.likes }));
        window.location.reload()
      } else {
        console.error('Failed to like post:', response.statusText);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (!postInfo) return '';

  return (
    <div class="post-page">
  <div class="header">
    <h1>{postInfo.title}</h1>
    <div class="likes">
      <button class="like-btn" onClick={handleLike}>
        Like
      </button>
      <span>{postInfo.likes} Likes</span>
    </div>
  </div>
  <div class="meta">
    <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
    <div class="author">by @{postInfo.author.username}</div>
    {userInfo.id === postInfo.author._id && (
    <div class="edit-row">
      <Link class="edit-btn" to={`/edit/${postInfo._id}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        Edit this post
      </Link>
    </div>
    )}
  </div>
  <div class="image">
    <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
  </div>
  <div class="content" dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>

  
  {/* Add comment form */}
  <form onSubmit={handleCommentSubmit}>
    <textarea
      className="comment-textarea"
      value={commentContent}
      onChange={e => setCommentContent(e.target.value)}
      placeholder="Add a comment"
      required
    ></textarea>
    <button type="submit">Add Comment</button>
  </form>

  {/* Display comments */}
  <div class="comments">
    {postInfo.comments &&
      postInfo.comments
      .slice()
      .reverse()
      .map((comment, index) => (
        <div key={index} class="comment">
          <p>{comment.content}</p>
          <time>{formatISO9075(new Date(comment.createdAt))}</time>
        </div>
      ))}
  </div>
</div>


  );
}
