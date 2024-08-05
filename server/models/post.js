// server/models/post.js

const { supabase } = require("../util/database"); // Supabase client

// Function to create a post
async function createPost(title, content, userId, privateStatus) {
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, userId, privateStatus }]);

  if (error) {
    console.error("Error creating post:", error.message);
    throw new Error("Failed to create post");
  }

  return data[0]; // Return the created post data
}

// Function to find all posts
async function findAllPosts() {
  const { data, error } = await supabase.from("posts").select("*");

  if (error) {
    console.error("Error fetching posts:", error.message);
    throw new Error("Failed to retrieve posts");
  }

  return data; // Return posts data
}

// Function to update a post
async function updatePost(id, updateData) {
  const { data, error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating post:", error.message);
    throw new Error("Failed to update post");
  }

  return data; // Return updated post data
}

// Function to delete a post
async function deletePost(id) {
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting post:", error.message);
    throw new Error("Failed to delete post");
  }

  return true; // Indicate success
}

module.exports = {
  createPost,
  findAllPosts,
  updatePost,
  deletePost,
};
