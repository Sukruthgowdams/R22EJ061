import React, { useEffect, useState } from "react";
import { fetchTrendingPosts } from "../api";
import { Card, CardContent, Typography } from "@mui/material";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTrendingPosts().then(setPosts);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Live Feed</h2>
      {posts.map((post) => (
        <Card key={post.id} style={{ margin: "10px", padding: "10px" }}>
          <CardContent>
            <Typography>{post.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Feed;
