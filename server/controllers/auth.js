// server/controllers/auth.js

const { supabase } = require("../util/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

const createToken = (username, id) => {
  return jwt.sign({ username, id }, SECRET, { expiresIn: "2 days" });
};

const sendResponse = (res, user, token) => {
  const exp = Date.now() + 1000 * 60 * 60 * 48;
  const data = {
    username: user.username,
    userId: user.id,
    token: token,
    exp: exp,
  };
  res.status(200).send(data);
};

module.exports = {
  // Ensure these functions are correctly exported
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Register Request:", req.body); // Log the incoming request data

      // Check if the user already exists
      const { data: foundUser, error: findError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      console.log("Found User in Register:", foundUser); // Log the found user data

      if (findError && findError.code !== "PGRST116") {
        console.error("Error finding user:", findError.message);
        return res.status(500).send("Internal Server Error");
      }

      if (foundUser) {
        return res.status(409).send("Username is taken!");
      }

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // Insert new user
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([{ username, hashedPass: hash }])
        .select("*")
        .single();

      if (createError) {
        console.error("Error creating user:", createError.message);
        return res.status(500).send("Internal Server Error");
      }

      // Create a JWT token
      const token = createToken(newUser.username, newUser.id);
      sendResponse(res, newUser, token);
    } catch (error) {
      console.error("ERROR IN register:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("controllers/auth.js - Login Request:", req.body); // Log the incoming request data

      const { data: foundUser, error: findError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      console.log("(controllers/auth.js) Found User in Login:", foundUser); // Log the found user data

      if (findError) {
        console.error("Error finding user:", findError.message);
        return res.status(404).send("User does not exist.");
      }

      const isAuthenticated = bcrypt.compareSync(
        password,
        foundUser.hashedPass
      );
      if (!isAuthenticated) {
        return res.status(401).send("Password is incorrect");
      }

      const token = createToken(foundUser.username, foundUser.id);
      sendResponse(res, foundUser, token);
    } catch (error) {
      console.error("ERROR IN login:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
