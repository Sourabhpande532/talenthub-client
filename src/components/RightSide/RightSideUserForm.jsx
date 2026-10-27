import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import "./RightSideUserForm.css";
import { registerUser } from "../../features/auth/authSlice";

function useRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    experience: "",
    location: "",
    skills: "",
    resume: "",
    companyName: "",
  });
  const [uploading] = useState(false);
  const { status, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return {
    formData,
    uploading,
    status,
    dispatch,
    navigate,
    handleChange,
  };
}

export const RightSideUserForm = ({ role, setRole }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { formData, uploading, status, dispatch, navigate, handleChange } =
    useRegistration();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Full Name is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
    };

    if (role === "Applicant") {
      if (formData.resume && formData.resume.trim()) {
        try {
          const normalizedResume = /^https?:\/\//i.test(formData.resume.trim())
            ? formData.resume.trim()
            : `https://${formData.resume.trim()}`;
          new URL(normalizedResume);
          payload.resume = normalizedResume;
        } catch {
          toast.error("Please enter a valid Resume URL.");
          return;
        }
      } else {
        payload.resume = "";
      }
      payload.experience = formData.experience;
      payload.location = formData.location;
      payload.skills = formData.skills
        ? formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    } else {
      payload.companyName = formData.companyName;
    }

    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      if (role === "Applicant" && formData.resume) {
        localStorage.setItem("temp_resume", formData.resume);
      }
      navigate("/login");
    }
  };

  return (
    <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 bg-white">
      {/* Mobile Role Switcher (Visible below LG) */}
      <div className="lg:hidden mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">
          Create your account
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          Select your account type to get started
        </p>
        <div
          className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200"
          role="group"
          aria-label="Account role">
          <button
            type="button"
            onClick={() => setRole("Applicant")}
            className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              role === "Applicant"
                ? "bg-navy-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}>
            <i className="bi bi-person-workspace"></i>
            <span>Applicant</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("Recruiter")}
            className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              role === "Recruiter"
                ? "bg-navy-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}>
            <i className="bi bi-building"></i>
            <span>Recruiter</span>
          </button>
        </div>
      </div>

      {/* Desktop Form Heading */}
      <div className="hidden lg:block mb-6">
        <h2 className="font-display text-xl font-bold text-slate-900 m-0">
          {role === "Applicant"
            ? "Candidate Registration"
            : "Recruiter Registration"}
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-0">
          {role === "Applicant"
            ? "Complete your profile to apply for roles and generate AI interview guides."
            : "Set up your employer account to publish roles and manage applicants."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="reg-name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              value={formData.name}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400"
              placeholder="Enter your full name"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={formData.email}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400"
                placeholder="Create a password (min 6 chars)"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 flex items-center justify-center"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label="Toggle password visibility">
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  }`}></i>
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-confirm-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <input
                id="reg-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400"
                placeholder="Confirm your password"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 flex items-center justify-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
                aria-label="Toggle confirm password visibility">
                <i
                  className={`bi ${
                    showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                  }`}></i>
              </button>
            </div>
          </div>

          {role === "Applicant" ? (
            <>
              <div>
                <label
                  htmlFor="reg-experience"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Experience
                </label>
                <select
                  id="reg-experience"
                  name="experience"
                  value={formData.experience}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 cursor-pointer"
                  onChange={handleChange}
                  required>
                  <option value="">Select your experience</option>
                  <option value="Fresher">Fresher (0 years)</option>
                  <option value="1-3 Yrs">1 - 3 Years</option>
                  <option value="3-5 Yrs">3 - 5 Years</option>
                  <option value="5+ Yrs">5+ Years</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="reg-location"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Current Location
                </label>
                <input
                  id="reg-location"
                  type="text"
                  name="location"
                  value={formData.location}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400"
                  placeholder="e.g. Bangalore, India"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="reg-skills"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Skills (Optional)
                </label>
                <input
                  id="reg-skills"
                  type="text"
                  name="skills"
                  value={formData.skills}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400"
                  placeholder="e.g. React, Node.js, SQL (Comma separated)"
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="reg-resume"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Resume URL (Optional)
                </label>
                <input
                  id="reg-resume"
                  type="text"
                  inputMode="url"
                  name="resume"
                  value={formData.resume}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400"
                  placeholder="Paste Google Drive or Portfolio link"
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            <div className="sm:col-span-2">
              <label
                htmlFor="reg-company"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Company Name
              </label>
              <input
                id="reg-company"
                type="text"
                name="companyName"
                value={formData.companyName}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400"
                placeholder="Enter company name"
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>

        <div className="mt-5 mb-5">
          <label
            htmlFor="termsCheck"
            className="inline-flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-navy-900 cursor-pointer flex-shrink-0"
              id="termsCheck"
              required
            />
            <span>
              I agree to the{" "}
              <span className="font-semibold text-navy-900">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-semibold text-navy-900">
                Privacy Policy
              </span>
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
          disabled={status === "loading" || uploading}>
          {status === "loading" && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          )}
          <span>
            {status === "loading" ? "Creating Account..." : "Create Account"}
          </span>
        </button>

        {/* Mobile Login Link */}
        <div className="lg:hidden mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600 m-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-700 hover:underline no-underline">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
