// server/models/index.js

const { createUser, findUserByUsername } = require("./user");
const { createPost, findAllPosts, updatePost, deletePost } = require("./post");

module.exports = {
  createUser,
  findUserByUsername,
  createPost,
  findAllPosts,
  updatePost,
  deletePost,
};
