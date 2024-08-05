// server/models/user.js

const { supabase } = require("../util/database"); // Supabase client

// Function to create a user
async function createUser(username, hashedPass) {
  const { data, error } = await supabase
    .from("users")
    .insert([{ username, hashedPass }]);

  if (error) {
    console.error("Error creating user:", error.message);
    throw new Error("Failed to create user");
  }

  return data[0]; // Return the created user data
}

// Function to find a user by username
async function findUserByUsername(username) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error finding user by username:", error.message);
    throw new Error("User not found");
  }

  return data; // Return the found user data
}

module.exports = {
  createUser,
  findUserByUsername,
};
