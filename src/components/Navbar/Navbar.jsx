import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Close user dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const bookmarkCount = user?.bookmarks?.length || 0;
  const avatarUrl =
    user?.role === "Recruiter" ? user?.companyLogo : user?.photo;

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200 shadow-nav">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Primary Navigation">
        {/* Left: Brand & Primary Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-navy-900 hover:opacity-90 transition-opacity no-underline">
            <span className="w-9 h-9 rounded-lg bg-navy-900 text-white flex items-center justify-center shadow-sm">
              <i className="bi bi-briefcase-fill text-base text-brand-400"></i>
            </span>
            <span className="font-display font-bold text-xl tracking-tight text-navy-900">
              Talent<span className="text-brand-600">Hub</span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
            <li>
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                  isActive("/")
                    ? "bg-slate-100 text-navy-900 font-semibold"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-50"
                }`}>
                Home
              </Link>
            </li>
            {user?.role !== "Recruiter" && (
              <li>
                <Link
                  to="/jobs"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                    isActive("/jobs")
                      ? "bg-slate-100 text-navy-900 font-semibold"
                      : "text-slate-600 hover:text-navy-900 hover:bg-slate-50"
                  }`}>
                  Find Jobs
                </Link>
              </li>
            )}
            {token && (
              <li>
                <Link
                  to="/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                    isActive("/dashboard")
                      ? "bg-slate-100 text-navy-900 font-semibold"
                      : "text-slate-600 hover:text-navy-900 hover:bg-slate-50"
                  }`}>
                  Dashboard
                </Link>
              </li>
            )}
            {token && user?.role === "Recruiter" && (
              <li>
                <Link
                  to="/create-job"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                    isActive("/create-job")
                      ? "bg-slate-100 text-navy-900 font-semibold"
                      : "text-slate-600 hover:text-navy-900 hover:bg-slate-50"
                  }`}>
                  Post a Job
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right: Actions & User Menu */}
        <div className="hidden lg:flex items-center gap-3">
          {token ? (
            <>
              {user?.role === "Applicant" && (
                <Link
                  to="/dashboard"
                  title="Saved Bookmarks"
                  className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-navy-900 hover:bg-slate-100 transition-colors no-underline">
                  <i className="bi bi-bookmark-check text-base text-brand-600"></i>
                  <span>Saved</span>
                  {bookmarkCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                      {bookmarkCount}
                    </span>
                  )}
                </Link>
              )}

              {user?.role === "Recruiter" && (
                <Link
                  to="/create-job"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors no-underline">
                  <i className="bi bi-plus-lg"></i>
                  <span>Post a Job</span>
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || "User"}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-semibold text-slate-800 leading-none m-0">
                      {user?.name}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 leading-none mt-1 m-0">
                      {user?.role}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-slate-800 xl:hidden">
                    {user?.name}
                  </span>
                  <i
                    className={`bi bi-chevron-down text-xs text-slate-500 transition-transform duration-150 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}></i>
                </button>

                {dropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate m-0">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate m-0 mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      role="menuitem"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-navy-900 no-underline">
                      <i className="bi bi-speedometer2 text-slate-400"></i>
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      role="menuitem"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-navy-900 no-underline">
                      <i className="bi bi-person text-slate-400"></i>
                      <span>Profile</span>
                    </Link>
                    {user?.role === "Recruiter" && (
                      <Link
                        to="/create-job"
                        role="menuitem"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-navy-900 no-underline">
                        <i className="bi bi-plus-circle text-slate-400"></i>
                        <span>Post a Job</span>
                      </Link>
                    )}
                    <div className="my-1 border-t border-slate-100"></div>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-navy-900 hover:bg-slate-100 border border-slate-200 transition-colors no-underline">
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-navy-900 hover:bg-navy-800 text-white shadow-sm transition-colors no-underline">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {token && user?.role === "Applicant" && (
            <Link
              to="/dashboard"
              aria-label="Saved Jobs"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 no-underline">
              <i className="bi bi-bookmark-check text-lg text-brand-600"></i>
              {bookmarkCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <i
              className={`bi ${
                mobileMenuOpen ? "bi-x-lg" : "bi-list"
              } text-2xl leading-none`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 shadow-lg">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              className={`px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                isActive("/")
                  ? "bg-slate-100 text-navy-900 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}>
              <i className="bi bi-house-door me-2 text-slate-400"></i>Home
            </Link>
            {user?.role !== "Recruiter" && (
              <Link
                to="/jobs"
                className={`px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                  isActive("/jobs")
                    ? "bg-slate-100 text-navy-900 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}>
                <i className="bi bi-search me-2 text-slate-400"></i>Find Jobs
              </Link>
            )}
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                    isActive("/dashboard")
                      ? "bg-slate-100 text-navy-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}>
                  <i className="bi bi-speedometer2 me-2 text-slate-400"></i>
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                    isActive("/profile")
                      ? "bg-slate-100 text-navy-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}>
                  <i className="bi bi-person me-2 text-slate-400"></i>Profile
                </Link>
                {user?.role === "Recruiter" && (
                  <Link
                    to="/create-job"
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                      isActive("/create-job")
                        ? "bg-slate-100 text-navy-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                    <i className="bi bi-plus-circle me-2 text-slate-400"></i>
                    Post a Job
                  </Link>
                )}
                <div className="my-2 border-t border-slate-100"></div>
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {avatarUrl && !avatarError ? (
                      <img
                        src={avatarUrl}
                        alt={user?.name || "User"}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate m-0">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate m-0">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 pt-3 mt-2 border-t border-slate-100">
                <Link
                  to="/login"
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-center text-slate-700 border border-slate-200 hover:bg-slate-50 no-underline">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-center bg-navy-900 text-white hover:bg-navy-800 no-underline">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export { Navbar };
