import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function useLogin() {
  const savedRememberedEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("remembered_email") || ""
      : "";
  const [formData, setFormData] = useState({
    email: savedRememberedEmail,
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(Boolean(savedRememberedEmail));
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (rememberMe) {
      localStorage.setItem("remembered_email", formData.email.trim());
    } else {
      localStorage.removeItem("remembered_email");
    }
    dispatch(loginUser(formData));
  };
  return {
    formData,
    rememberMe,
    setRememberMe,
    status,
    handleChange,
    handleSubmit,
  };
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    formData,
    rememberMe,
    setRememberMe,
    handleChange,
    handleSubmit,
    status,
  } = useLogin();

  return (
    <main className="auth-page bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center mx-auto mb-3.5 shadow-sm">
              <i className="bi bi-briefcase-fill text-xl text-brand-400"></i>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-slate-600 m-0">
              Log in to your TalentHub account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <i className="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <i className="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 flex items-center justify-center">
                  <i
                    className={`bi ${
                      showPassword ? "bi-eye-slash" : "bi-eye"
                    }`}></i>
                </button>
              </div>
            </div>

            {/* Remember Me (Optional preference — NOT required) */}
            <div className="flex items-center justify-between pt-1">
              <label
                htmlFor="rememberMe"
                className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-navy-900 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 mt-2">
              {status === "loading" && (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  role="status"
                  aria-hidden="true"></span>
              )}
              <span>{status === "loading" ? "Signing in..." : "Login"}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600 m-0">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-brand-700 hover:text-brand-800 hover:underline no-underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
