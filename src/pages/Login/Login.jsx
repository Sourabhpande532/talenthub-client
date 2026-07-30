/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
  }
  return (
    <div className='login-page-container'>
      <div className='login-box animate-fade-in'>
        <h2>Welcome Back</h2>
        <p className='text-center text-secondary mb-4'>
          Login to continue to collabcore
        </p>

        <form onSubmit={handleLogin}>
          <div className='user-box'>
            <label>Email Address</label>
            <input
              type='email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder='e.g. name@company.com'
              required
            />
          </div>

          <div className='user-box'>
            <label>Password</label>
            <input
              type='password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder='••••••••'
              required
            />
          </div>

          <button type='submit' className='login-btn'>
            Sign In
          </button>
          <div className='sign-link-container'>
            Don't have an account? <Link to='/register'>Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
