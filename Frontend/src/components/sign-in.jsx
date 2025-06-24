import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css'; // ← import CSS file

const SignIn = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { name, password };

    try {
      const response = await fetch("http://localhost:5000/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.userData._id);
        console.log("Signed in");
        navigate("/your-tasks");
      } else {
        console.log("Invalid credentials");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="signin-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signin-input"
          required
        />
        <button type="submit" className="signin-button">Sign In</button>
        <p className="signin-switch">
            Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>

      </form>
    </div>
  );
};

export default SignIn;
