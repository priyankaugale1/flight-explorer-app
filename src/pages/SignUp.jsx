import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SignUp.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const validate = () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Enter a valid email");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    if (!validate()) return;

    const success = signup({ email, password, role });
    if (success) {
      toast.success("Signup successful! Redirecting to login...", { theme: "colored" });
      setTimeout(() => navigate("/priyankaugale1/login"), 2000);
    } else {
      toast.error("User already exists");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-left">
          <h1>Welcome!</h1>
          <p>Join the best flight booking experience. Create an account and fly with ease.</p>
        </div>
        <div className="signup-right">
          <h2>Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleSignup}>Signup</button>
          <p className="login-text">
            Already have an account? <span onClick={() => navigate("/priyankaugale1/login")}>Login</span>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default Signup;
