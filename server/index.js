// server/index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4005;
const { supabase } = require("./util/database"); // Use Supabase client

// Import controller functions
const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");
const { register, login } = require("./controllers/auth");
const { isAuthenticated } = require("./middleware/isAuthenticated");

app.use(express.json());
app.use(cors());

// API Endpoints
app.post("/register", register);
app.post("/login", login);

app.get("/posts", getAllPosts); // Ensure this function is imported and defined
app.get("/userposts/:userId", getCurrentUserPosts); // Ensure this function is imported and defined
app.post("/posts", isAuthenticated, addPost); // Ensure this function is imported and defined
app.put("/posts/:id", isAuthenticated, editPost); // Ensure this function is imported and defined
app.delete("/posts/:id", isAuthenticated, deletePost); // Ensure this function is imported and defined

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
