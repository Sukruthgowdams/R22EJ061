import React from "react";
import TopUsers from "../components/TopUsers";
import TrendingPosts from "../components/TrendingPosts";
import Feed from "../components/Feed";

const Home = () => {
  return (
    <div>
      <TopUsers />
      <TrendingPosts />
      <Feed />
    </div>
  );
};

export default Home;
