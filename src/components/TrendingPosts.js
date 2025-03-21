import React, { useEffect, useState } from "react";
import { fetchTrendingPosts } from "../api";
import "../App.css";

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTrendingPosts = async () => {
      const data = await fetchTrendingPosts();
      console.log("Trending Posts in Component:", data); // ✅ Log to check data
      setPosts(data);
      setLoading(false);
    };
    getTrendingPosts();
  }, []);

  return (
    <div className="container">
      <h2>📈 Trending Posts</h2>
      {loading ? (
        <p>Loading trending posts... 🔄</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <strong>📝 {post.content}</strong> <br />
              💬 {post.commentsCount} Comments
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrendingPosts;
