import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setUser } from "../../features/auth/authSlice";
import { fetchProfile, updateProfile } from "../../features/user/userSlice";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    bio: "",
    experience: "",
    education: "",
    skills: "",
    companyName: "",
    companyLogo: "",
    website: "",
    aboutCompany: "",
    resume: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        photo: user.photo || "",
        bio: user.bio || "",
        experience: user.experience || "",
        education: user.education || "",
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : user.skills || "",
        companyName: user.companyName || "",
        companyLogo: user.companyLogo || "",
        website: user.website || "",
        aboutCompany: user.aboutCompany || "",
        resume: user.resume || "",
      });
      setImgError(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "photo" || name === "companyLogo") {
      setImgError(false);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidOptionalUrl = (val) => {
    if (!val || !val.trim()) return true;
    try {
      const normalized = /^https?:\/\//i.test(val.trim())
        ? val.trim()
        : `https://${val.trim()}`;
      new URL(normalized);
      return true;
    } catch {
      return false;
    }
  };

  const normalizeOptionalUrl = (val) => {
    if (!val || !val.trim()) return "";
    const trimmed = val.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (user?.role === "Applicant") {
      if (!isValidOptionalUrl(formData.resume)) {
        toast.error("Please enter a valid Resume URL");
        return;
      }
      if (!isValidOptionalUrl(formData.photo)) {
        toast.error("Please enter a valid Profile Photo URL");
        return;
      }
    } else if (user?.role === "Recruiter") {
      if (!isValidOptionalUrl(formData.website)) {
        toast.error("Please enter a valid Company Website URL");
        return;
      }
      if (!isValidOptionalUrl(formData.companyLogo)) {
        toast.error("Please enter a valid Company Logo URL");
        return;
      }
    }

    const payload = {
      ...formData,
      photo: normalizeOptionalUrl(formData.photo),
      companyLogo: normalizeOptionalUrl(formData.companyLogo),
      website: normalizeOptionalUrl(formData.website),
      resume: normalizeOptionalUrl(formData.resume),
    };

    if (user.role === "Applicant") {
      payload.skills =
        typeof formData.skills === "string"
          ? formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : formData.skills;
    }

    const res = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(res)) {
      dispatch(setUser(res.payload));
      setIsEditing(false);
    }
  };

  const getProfileStrength = () => {
    if (user?.role !== "Applicant") return 100;
    let score = 20; // Base score for Name & Email
    if (user.bio) score += 15;
    if (user.experience) score += 20;
    if (user.education) score += 15;
    if (user.skills?.length > 0) score += 15;
    if (user.resume) score += 15;
    return Math.min(score, 100);
  };

  const strength = getProfileStrength();
  const avatarSrc =
    user?.role === "Recruiter"
      ? formData.companyLogo || user?.companyLogo
      : formData.photo || user?.photo;

  const inputClass = (editable) =>
    `w-full px-4 py-2.5 rounded-xl text-sm transition-all ${
      editable
        ? "bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/15 shadow-sm"
        : "bg-slate-100/80 border border-slate-200/80 text-slate-700 cursor-default"
    }`;

  const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

  return (
    <div className="profile-page min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {!user ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-card">
            <i className="bi bi-exclamation-circle text-amber-500 text-4xl mb-3 block"></i>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Profile Data Missing
            </h2>
            <p className="text-sm text-slate-500">
              Your session data seems to be outdated. Please log out and log back in to refresh your profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar Info Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
                <div className="h-24 bg-navy-900 relative">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>
                <div className="px-6 pb-6 text-center relative">
                  <div className="-mt-12 mb-3 inline-flex">
                    {avatarSrc && !imgError ? (
                      <img
                        src={avatarSrc}
                        alt={user?.name}
                        onError={() => setImgError(true)}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-teal-600 text-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-extrabold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900">
                    {user?.name}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>

                  {user?.role === "Recruiter" && user?.companyName && (
                    <p className="text-xs font-semibold text-teal-700 mt-1">
                      <i className="bi bi-building me-1"></i>
                      {user.companyName}
                    </p>
                  )}

                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                      <i
                        className={`bi ${
                          user?.role === "Recruiter"
                            ? "bi-briefcase-fill"
                            : "bi-person-badge-fill"
                        }`}
                      ></i>
                      {user?.role}
                    </span>
                  </div>

                  {user?.role === "Applicant" && (
                    <div className="mt-6 pt-6 border-t border-slate-100 text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Profile Strength
                        </span>
                        <span
                          className={`text-xs font-extrabold ${
                            strength === 100
                              ? "text-emerald-600"
                              : "text-teal-600"
                          }`}
                        >
                          {strength}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            strength === 100 ? "bg-emerald-500" : "bg-teal-600"
                          }`}
                          style={{ width: `${strength}%` }}
                        ></div>
                      </div>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600 list-none pl-0 mb-0">
                        <li className="flex items-center gap-2">
                          <i
                            className={`bi ${
                              user?.bio
                                ? "bi-check-circle-fill text-emerald-500"
                                : "bi-circle text-slate-300"
                            }`}
                          ></i>
                          Add Professional Bio
                        </li>
                        <li className="flex items-center gap-2">
                          <i
                            className={`bi ${
                              user?.skills?.length > 0
                                ? "bi-check-circle-fill text-emerald-500"
                                : "bi-circle text-slate-300"
                            }`}
                          ></i>
                          Add Key Skills
                        </li>
                        <li className="flex items-center gap-2">
                          <i
                            className={`bi ${
                              user?.experience
                                ? "bi-check-circle-fill text-emerald-500"
                                : "bi-circle text-slate-300"
                            }`}
                          ></i>
                          Add Experience Level
                        </li>
                        <li className="flex items-center gap-2">
                          <i
                            className={`bi ${
                              user?.education
                                ? "bi-check-circle-fill text-emerald-500"
                                : "bi-circle text-slate-300"
                            }`}
                          ></i>
                          Add Education Details
                        </li>
                        <li className="flex items-center gap-2">
                          <i
                            className={`bi ${
                              user?.resume
                                ? "bi-check-circle-fill text-emerald-500"
                                : "bi-circle text-slate-300"
                            }`}
                          ></i>
                          Link Resume / Portfolio
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Links Card (Resume for Applicant / Website for Recruiter) */}
              {user?.role === "Applicant" && formData.resume && !isEditing && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Candidate Resume
                  </h3>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <i className="bi bi-file-earmark-text text-lg"></i>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-800 mb-0 truncate">
                          Resume Document
                        </p>
                        <p className="text-xs text-slate-400 mb-0 truncate">
                          {formData.resume}
                        </p>
                      </div>
                    </div>
                    <a
                      href={normalizeOptionalUrl(formData.resume)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors no-underline shrink-0 ml-2"
                    >
                      Open
                    </a>
                  </div>
                </div>
              )}

              {user?.role === "Recruiter" && formData.website && !isEditing && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Company Website
                  </h3>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <i className="bi bi-globe2 text-lg"></i>
                      </div>
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {formData.website}
                      </span>
                    </div>
                    <a
                      href={normalizeOptionalUrl(formData.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-colors no-underline shrink-0 ml-2"
                    >
                      Visit
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Main Form / Details Card */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
                <div className="px-6 sm:px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900">
                      Profile Information
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isEditing
                        ? "Update your personal and professional details below."
                        : "View and manage your account details."}
                    </p>
                  </div>
                  {!isEditing ? (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition-colors"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil-square"></i> Edit Profile
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                      onClick={() => setIsEditing(false)}
                    >
                      <i className="bi bi-x-lg"></i> Cancel
                    </button>
                  )}
                </div>

                <div className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          className={inputClass(isEditing)}
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                        />
                      </div>

                      {user?.role === "Applicant" ? (
                        <div>
                          <label className={labelClass}>
                            Profile Photo URL
                          </label>
                          <input
                            type="text"
                            inputMode="url"
                            name="photo"
                            className={inputClass(isEditing)}
                            value={formData.photo}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="https://example.com/photo.jpg"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className={labelClass}>Company Name</label>
                          <input
                            type="text"
                            name="companyName"
                            className={inputClass(isEditing)}
                            value={formData.companyName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="e.g. Acme Technologies"
                          />
                        </div>
                      )}
                    </div>

                    {user?.role === "Applicant" ? (
                      <>
                        <div>
                          <label className={labelClass}>Professional Bio</label>
                          <textarea
                            name="bio"
                            className={inputClass(isEditing)}
                            rows="3"
                            value={formData.bio}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Tell recruiters about your background, strengths, and career goals..."
                          ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className={labelClass}>Experience</label>
                            <input
                              type="text"
                              name="experience"
                              className={inputClass(isEditing)}
                              value={formData.experience}
                              onChange={handleChange}
                              disabled={!isEditing}
                              placeholder="e.g. 3+ Yrs in React / Node.js"
                            />
                          </div>

                          <div>
                            <label className={labelClass}>Education</label>
                            <input
                              type="text"
                              name="education"
                              className={inputClass(isEditing)}
                              value={formData.education}
                              onChange={handleChange}
                              disabled={!isEditing}
                              placeholder="e.g. B.Tech Computer Science"
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Skills (comma separated)
                          </label>
                          <input
                            type="text"
                            name="skills"
                            className={inputClass(isEditing)}
                            value={formData.skills}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="React, Node.js, TypeScript, Express, MongoDB"
                          />
                          {!isEditing &&
                            formData.skills &&
                            formData.skills.trim().length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {formData.skills
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                                  .map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/70"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                              </div>
                            )}
                        </div>

                        <div>
                          <label className={labelClass}>
                            Resume Link (Google Drive, Portfolio, LinkedIn, etc.)
                          </label>
                          <input
                            type="text"
                            inputMode="url"
                            name="resume"
                            className={inputClass(isEditing)}
                            placeholder="https://drive.google.com/..."
                            value={formData.resume}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className={labelClass}>
                              Company Logo URL
                            </label>
                            <input
                              type="text"
                              inputMode="url"
                              name="companyLogo"
                              className={inputClass(isEditing)}
                              value={formData.companyLogo}
                              onChange={handleChange}
                              disabled={!isEditing}
                              placeholder="https://example.com/logo.png"
                            />
                          </div>

                          <div>
                            <label className={labelClass}>
                              Company Website
                            </label>
                            <input
                              type="text"
                              inputMode="url"
                              name="website"
                              className={inputClass(isEditing)}
                              value={formData.website}
                              onChange={handleChange}
                              disabled={!isEditing}
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>About Company</label>
                          <textarea
                            name="aboutCompany"
                            className={inputClass(isEditing)}
                            rows="4"
                            value={formData.aboutCompany}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Briefly describe your company culture, products, and mission..."
                          ></textarea>
                        </div>
                      </>
                    )}

                    {isEditing && (
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-colors"
                          disabled={status === "loading"}
                        >
                          {status === "loading" ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
