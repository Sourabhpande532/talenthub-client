import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-ligh shadow-sm position-sticky'>
        <div className='container'>
          <Link to='/' className='navbar-brand fw-bold'>
            Logo
          </Link>
          <button
            className='navbar-toggler'
            data-bs-target='#navContent'
            data-bs-toggle='collapse'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navContent'>
            <ul className='nav'>
              <li className='nav-item'>
                <Link to='/' className='nav-link'>
                  Home
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/dashboard' className='nav-link'>
                  Dashboard
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/report' className='nav-link'>
                  Reports
                </Link>
              </li>
              {isLoggedIn ? (
                <li className='nav-item'>
                  <Link onClick={() => logout()} className='nav-link'>
                    logout
                  </Link>
                </li>
              ) : (
                <li className='nav-item'>
                  <Link to='/login' className='nav-link'>
                    login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
