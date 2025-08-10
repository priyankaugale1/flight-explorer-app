// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      toast.warn("Please fill in all fields", { theme: "colored" });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find(u => u.email === email);

    if (!exists) {
      toast.error("User not found. Redirecting to signup...", { theme: "colored" });
      setTimeout(() => navigate("/priyankaugale1/signup", { state: { email } }), 1500);
      return;
    }

    const success = login(email, password);
    if (success) {
      const user = JSON.parse(localStorage.getItem("user"));
      toast.success("Login successful!", { theme: "colored" });
      setTimeout(() => {
        navigate(user.role === "admin" ? "/priyankaugale1/admin" : "/priyankaugale1/user");
      }, 1000);
    } else {
      toast.error("Invalid password", { theme: "colored" });
    }
  };

  return (
    <div>
      <h1 className="login-heading animated">Flight Explorer App</h1>
      <div className="login-container">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="login-right">
          <h2 className="login-title">Sign In</h2>
          <p className="login-subtitle">Welcome back! Please login to your account.</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            className="login-input"
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="login-input"
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
          <p className="signup-link">
            Don’t have an account?{' '}
            <span onClick={() => navigate("/priyankaugale1/signup")} className="signup-text">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>

  );
};

export default Login;
