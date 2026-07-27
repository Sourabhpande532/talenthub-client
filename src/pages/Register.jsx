import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { userRegister } = useAuth();
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const registerUser = await userRegister(form);
      if (registerUser) {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      toast.error("Fail registration");
    }
  }
  return (
    <div className='signup-page-container'>
      <div className='signup-box animate-fade-in'>
        <h2>Create Account</h2>
        <p className='text-center text-secondary mb-4'>Join collabcore today</p>

        <form onSubmit={handleRegister}>
          <div className='user-box'>
            <label>Full Name</label>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder='Your Name'
              required
            />
          </div>

          <div className='user-box'>
            <label>Email Address</label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder='name@company.com'
              required
            />
          </div>

          <div className='user-box'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder='••••••••'
              required
            />
          </div>

          <button type='submit' className='signup-btn'>
            Sign Up
          </button>

          <div className='login-link-container'>
            Already have an account? <Link to='/login'>Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
