import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
  const { token, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <nav className='navbar navbar-expand-lg custom-navbar sticky-top'>
        <div className='container'>
          <Link to='/' className='navbar-brand fw-bold text-primary brand-logo'>
            <i className='bi bi-briefcase-fill me-2'></i>
            TalentHub
          </Link>

          <button
            className='navbar-toggler border-0'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navContent'>
            <span className='navbar-toggler-icon'></span>
          </button>

          <div className='collapse navbar-collapse' id='navContent'>
            {/* Middle Search Bar - Visible only on large screens if needed, otherwise links */}
            <ul className='navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4'>
              <li className='nav-item'>
                <Link to='/jobs' className='nav-link fw-medium'>
                  Find Jobs
                </Link>
              </li>
            </ul>

            <div className='d-flex align-items-center gap-3 mt-3 mt-lg-0 pb-3 pb-lg-0'>
              {token ? (
                <div className='dropdown'>
                  <button
                    className='btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 user-menu-btn'
                    type='button'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'>
                    <div className='avatar-circle bg-primary text-white'>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className='fw-medium'>{user?.name}</span>
                  </button>
                  <ul className='dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2'>
                    <li>
                      <Link className='dropdown-item' to='/dashboard'>
                        <i className='bi bi-speedometer2 me-2'></i> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className='dropdown-item' to='/profile'>
                        <i className='bi bi-person me-2'></i> Profile
                      </Link>
                    </li>
                    {user?.role === "Recruiter" && (
                      <li>
                        <Link className='dropdown-item' to='/create-job'>
                          <i className='bi bi-plus-circle me-2'></i> Post a Job
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className='dropdown-divider' />
                    </li>
                    <li>
                      <button
                        className='dropdown-item text-danger'
                        onClick={handleLogout}>
                        <i className='bi bi-box-arrow-right me-2'></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className='d-flex gap-2'>
                  <Link
                    to='/login'
                    className='btn btn-outline-primary fw-medium px-4 py-2 rounded-3'>
                    Log In
                  </Link>
                  <Link
                    to='/register'
                    className='btn btn-primary fw-medium px-4 py-2 rounded-3'>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export { Navbar };
