import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { name, password };

    try {
      const response = await fetch("http://localhost:5000/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        console.log("Account created");
        navigate("/sign-in");
      } else {
        console.log("Failed to create account");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create Account</h2>
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
          required
        />
        <button type="submit" className="signup-button">Sign Up</button>
        <p className="signup-switch">
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
