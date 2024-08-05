// src/components/Home.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/authContext";

const Home = () => {
  const { state } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("/posts")
      .then((res) => {
        if (state.userId) {
          const otherUsersPosts = res.data.filter(
            (post) => state.userId !== post.userId
          );
          setPosts(otherUsersPosts);
        } else {
          setPosts(res.data);
        }
        console.log("Fetched posts:", res.data); // Debug log
      })
      .catch((err) => {
        console.log(err);
      });
  }, [state.userId]);

  const mappedPosts = posts.map((post) => {
    return (
      <div key={post.id} className="post-card">
        <h2>{post.title}</h2>
        <h4>{post.user.username}</h4>
        <p>{post.content}</p>
      </div>
    );
  });

  return (
    <main>
      {mappedPosts.length >= 1 ? mappedPosts : <h1>There are no posts yet!</h1>}
    </main>
  );
};

export default Home;
