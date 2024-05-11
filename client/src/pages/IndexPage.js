import Post from "../Post";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    // Fetch posts based on user preferences if user is logged in
    if (userInfo && userInfo.id) {
      fetch(`http://localhost:4000/post/${userInfo.id}`).then(response => {
        response.json().then(posts => {
          setPosts(posts);
        });
      }).catch(error => {
        console.error('Error:', error);
        setPosts([]); // Set posts to empty array if there's an error
      });
    } else {
      // Fetch all posts if user is not logged in
      fetch('http://localhost:4000/post').then(response => {
        response.json().then(posts => {
          setPosts(posts);
        });
      }).catch(error => {
        console.error('Error:', error);
        setPosts([]); // Set posts to empty array if there's an error
      });
    }
  }, [userInfo]); // Fetch posts whenever userInfo changes

  return (
    <>
      {posts.length > 0 ? (
        posts.map(post => (
          <Post key={post._id} {...post} />
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </>
  );
}
