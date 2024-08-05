// server/util/database.js

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
console.log(process.env.VITE_SUPABASE_URL);
// Check if SUPABASE_URL and SUPABASE_KEY are defined
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and Key environment variables are not defined");
}

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase client initialized successfully.");

module.exports = {
  supabase,
};
