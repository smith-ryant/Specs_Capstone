// src/components/Auth.js

import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/authContext";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(true);
  const { dispatch } = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();
    let body = { username, password };
    axios
      .post(register ? "/register" : "/login", body)
      .then((res) => {
        dispatch({ type: "LOGIN", payload: res.data });
        console.log("Login successful:", res.data); // Debug log
      })
      .catch((err) => {
        if (err.response.data) {
          alert(err.response.data);
        }
        console.error(err);
      });
    console.log("Authorization (Auth.js) submitHandler called");
  };

  return (
    <main>
      <h1>Welcome!</h1>
      <form className="form auth-form" onSubmit={submitHandler}>
        <input
          className="form-input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-input"
          placeholder="Password"
          type="password" // Ensure this is set to password for security
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="form-btn">{register ? "Sign Up" : "Login"}</button>
      </form>
      <button className="form-btn" onClick={() => setRegister(!register)}>
        Need to {register ? "Login" : "Sign Up"}?
      </button>
    </main>
  );
};

export default Auth;
