import axios from "axios";

const API_BASE = "http://20.244.56.144/test";
const TOKEN =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTM4MjA1LCJpYXQiOjE3NDI1Mzc5MDUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJiZTVmNjFlLWEyMDEtNGZiNC1iOGY2LTA4YjFkOGQ4MzhjMyIsInN1YiI6InVnY2V0MjIwMjk4QHJldmEuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkTWVkIiwiY2xpZW50SUQiOiJiYmU1ZjYxZS1hMjAxLTRmYjQtYjhmNi0wOGIxZDhkODM4YzMiLCJjbGllbnRTZWNyZXQiOiJha2djUGhwdFdlSUFlQnVIIiwib3duZXJOYW1lIjoiU3VrcnV0aCBNUyIsIm93bmVyRW1haWwiOiJ1Z2NldDIyMDI5OEByZXZhLmVkdS5pbiIsInJvbGxObyI6IlIyMkVKMDYxIn0.g36rX0kiQCUTq3Syk9Ofpk4G-UCK6h1G07Myin75v1c"; // Use your actual token

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${TOKEN}` },
    timeout: 5000,
  });
  
  export const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      const users = Object.entries(res.data.users).map(([id, name]) => ({ id, name }));
  
      // ✅ Fetch all post counts in parallel
      const postRequests = users.map(user =>
        axiosInstance.get(`/users/${user.id}/posts`).catch(() => ({ data: { posts: [] } }))
      );
  
      const postResponses = await Promise.all(postRequests);
      
      // ✅ Assign post count to each user
      users.forEach((user, index) => {
        user.postCount = postResponses[index].data.posts.length || 0;
      });
  
      // ✅ Sort & return top 5 users
      users.sort((a, b) => b.postCount - a.postCount);
      return users.slice(0, 5);
    } catch (error) {
      console.error("Fetch Users Error:", error.message);
      return [];
    }
  };
  
  
  
  // ✅ Fetch Posts by User ID
  export const fetchPostsByUser = async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/${userId}/posts`);
      return res.data.posts;
    } catch (error) {
      console.error(`Fetch Posts Error for User ${userId}:`, error.message);
      return [];
    }
  };
  
export const fetchTrendingPosts = async () => {
  try {
    console.log("Fetching Trending Posts...");
    const usersRes = await axiosInstance.get("/users");
    const userIds = Object.keys(usersRes.data.users);

    // ✅ Fetch all posts in parallel
    const postsRequests = userIds.map(userId =>
      axiosInstance.get(`/users/${userId}/posts`).catch(() => ({ data: { posts: [] } }))
    );

    const postsResponses = await Promise.all(postsRequests);
    let allPosts = postsResponses.flatMap(res => res.data.posts);

    // ✅ Fetch comments for all posts in parallel
    const commentsRequests = allPosts.map(post =>
      axiosInstance.get(`/posts/${post.id}/comments`).catch(() => ({ data: { comments: [] } }))
    );

    const commentsResponses = await Promise.all(commentsRequests);
    
    // ✅ Attach comment counts to posts
    allPosts.forEach((post, index) => {
      post.commentsCount = commentsResponses[index].data.comments.length;
    });

    // ✅ Sort posts by most comments & return top 5
    allPosts.sort((a, b) => b.commentsCount - a.commentsCount);
    console.log("Trending Posts Data:", allPosts.slice(0, 5));
    return allPosts.slice(0, 5);
  } catch (error) {
    console.error("Fetch Trending Posts Error:", error.message);
    return [];
  }
};



  
  // ✅ Fetch Comments by Post ID
  export const fetchCommentsByPost = async (postId) => {
    try {
      const res = await axiosInstance.get(`/posts/${postId}/comments`);
      return res.data.comments;
    } catch (error) {
      console.error(`Fetch Comments Error for Post ${postId}:`, error.message);
      return [];
    }
  };
  export const fetchLiveFeed = async () => {
  try {
    console.log("Fetching Live Feed...");
    const usersRes = await axiosInstance.get("/users");
    const userIds = Object.keys(usersRes.data.users);

    // ✅ Fetch posts for all users in parallel
    const postsRequests = userIds.map(userId =>
      axiosInstance.get(`/users/${userId}/posts`).catch(() => ({ data: { posts: [] } }))
    );

    const postsResponses = await Promise.all(postsRequests);
    
    // ✅ Merge all posts into one array
    let liveFeedPosts = postsResponses.flatMap(res => res.data.posts);

    // ✅ Sort by newest posts first
    liveFeedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    console.log("Live Feed Posts:", liveFeedPosts);
    return liveFeedPosts;
  } catch (error) {
    console.error("Fetch Live Feed Error:", error.message);
    return [];
  }
};
