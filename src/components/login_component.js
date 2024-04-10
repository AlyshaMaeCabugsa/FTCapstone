import { Link } from 'react-router-dom';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './SignInSignUp.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  function handleSubmit(e) {
    e.preventDefault();

    console.log(email, password);
    fetch("http://localhost:5000/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "ok") {
        localStorage.setItem("token", data.data);
        localStorage.setItem("loggedIn", true);
        // Calculate the expiration time and set it
        localStorage.setItem('expiresAt', Date.now() + (60 * 60 * 1000)); // 1 hour from now
        navigate("/admin-dashboard"); // Navigate to the dashboard using the navigate function
      } else {
        // Handle the error, such as showing an error message
      }
    });
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign In</h3>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right">
            <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
