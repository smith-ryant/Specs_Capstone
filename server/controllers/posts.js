// server/controllers/posts.js

const { supabase } = require("../util/database");

async function getAllPosts(req, res) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:users (username)
      `
      )
      .eq("privateStatus", false);

    if (error) {
      console.error("Error fetching posts with user data:", error.message);
      return res
        .status(400)
        .json({ message: "Failed to retrieve posts", error });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

async function getCurrentUserPosts(req, res) {
  try {
    const userId = req.params.userId;
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:users (username)
      `
      )
      .eq("userId", userId);

    if (error) {
      console.error("Error fetching user posts:", error.message);
      return res
        .status(400)
        .json({ message: "Failed to retrieve user's posts", error });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

async function addPost(req, res) {
  try {
    const { title, content, status, userId } = req.body;
    const { data, error } = await supabase.from("posts").insert([
      {
        title,
        content,
        privateStatus: status,
        userId,
      },
    ]);

    if (error) {
      console.error("ERROR IN addPost:", error.message);
      return res.status(400).json({ message: "Failed to add post", error });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

async function editPost(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabase
      .from("posts")
      .update({ privateStatus: status })
      .eq("id", id);

    if (error) {
      console.error("ERROR IN editPost:", error.message);
      return res.status(400).json({ message: "Failed to edit post", error });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error("ERROR IN deletePost:", error.message);
      return res.status(400).json({ message: "Failed to delete post", error });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

module.exports = {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
};
