import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

function useLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { status, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };
  return { formData, status, handleChange, handleSubmit };
}

const Login = () => {
  const { formData, handleChange, handleSubmit, status } = useLogin();
  return (
    <div className='auth-page bg-body-tertiary min-vh-100 d-flex align-items-center'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-lg-5'>
            <div className='card border-0 shadow-sm rounded-4 p-4 p-md-5'>
              <div className='text-center mb-4'>
                <i className='bi bi-briefcase-fill text-primary fs-1 mb-2 d-inline-block'></i>
                <h3 className='fw-bold'>Welcome back!</h3>
                <p className='text-muted'>Login to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label className='form-label fw-medium'>Email address</label>
                  <div className='input-group input-group-lg'>
                    <span className='input-group-text bg-body-tertiary border-end-0'>
                      <i className='bi bi-envelope text-muted'></i>
                    </span>
                    <input
                      type='email'
                      name='email'
                      className='form-control bg-body-tertiary border-start-0 ps-0 text-body'
                      placeholder='Enter your email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label className='form-label fw-medium'>Password</label>
                  <div className='input-group input-group-lg'>
                    <span className='input-group-text bg-body-tertiary border-end-0'>
                      <i className='bi bi-lock text-muted'></i>
                    </span>
                    <input
                      type='password'
                      name='password'
                      className='form-control bg-body-tertiary border-start-0 ps-0 text-body'
                      placeholder='Enter your password'
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className='d-flex justify-content-between align-items-center mb-4'>
                  <div className='form-check'>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id='rememberMe'
                    />
                    <label
                      className='form-check-label text-muted small'
                      htmlFor='rememberMe'>
                      Remember me
                    </label>
                  </div>
                </div>

                <button
                  type='submit'
                  className='btn btn-primary btn-lg w-100 rounded-pill fw-medium shadow-sm mb-4'
                  disabled={status === "loading"}>
                  {status === "loading" ? (
                    <span
                      className='spinner-border spinner-border-sm me-2'
                      role='status'
                      aria-hidden='true'></span>
                  ) : null}
                  Login
                </button>
              </form>

              <div className='text-center'>
                <p className='text-muted small mb-0'>
                  Don't have an account?{" "}
                  <Link
                    to='/register'
                    className='text-primary fw-bold text-decoration-none'>
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
