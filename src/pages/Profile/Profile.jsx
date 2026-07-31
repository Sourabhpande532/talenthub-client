/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {setUser} from "../../features/auth/authSlice"
import { updateProfile } from "../../features/user/userSlice";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    experience: "",
    education: "",
    skills: "",
    companyName: "",
    website: "",
    aboutCompany: "",
    resume: "",
  });

  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        experience: user.experience || "",
        education: user.education || "",
        skills: user.skills ? user.skills.join(", ") : "",
        companyName: user.companyName || "",
        website: user.website || "",
        aboutCompany: user.aboutCompany || "",
        resume: user.resume || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };
    if (user.role === "Applicant") {
      payload.skills = formData.skills.split(",").map(s => s.trim()).filter(s => s);
    }

    const res = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(res)) {
      dispatch(setUser(res.payload));
      setIsEditing(false);
    }
  };

  // Helper to calculate profile strength for applicant
  const getProfileStrength = () => {
    if (user?.role !== "Applicant") return 100;
    let score = 20; // Base score for Name & Email
    if (user.bio) score += 15;
    if (user.experience) score += 20;
    if (user.education) score += 15;
    if (user.skills?.length > 0) score += 15;
    if (user.resume) score += 15;
    return score;
  };

  const strength = getProfileStrength();

  return (
    <div className="profile-page bg-body-tertiary min-vh-100 py-4">
      <div className="container">
        <div className="row g-4">
          
          {!user ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-exclamation-circle text-warning fs-1 mb-3 d-block"></i>
              <h4>Profile Data Missing</h4>
              <p className="text-muted">Your session data seems to be outdated. Please log out and log back in to refresh your profile.</p>
            </div>
          ) : (
            <>
              {/* Sidebar Info Card */}
              <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4 text-center">
                <div className="profile-avatar-large bg-primary text-white mx-auto d-flex align-items-center justify-content-center fw-bold rounded-circle mb-3">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h4 className="fw-bold mb-1">{user?.name}</h4>
                <p className="text-muted mb-3">{user?.email}</p>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-medium">
                  {user?.role}
                </span>

                {user?.role === "Applicant" && (
                  <div className="mt-4 pt-4 border-top text-start">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-medium">Profile Strength</span>
                      <span className="fw-bold text-primary">{strength}%</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className={`progress-bar ${strength === 100 ? "bg-success" : "bg-primary"}`} role="progressbar" style={{ width: `${strength}%` }}></div>
                    </div>
                    <ul className="list-unstyled mt-3 small text-muted">
                      <li><i className={`bi ${user?.bio ? "bi-check-circle-fill text-success" : "bi-circle"} me-2`}></i> Add Bio</li>
                      <li><i className={`bi ${user?.skills?.length > 0 ? "bi-check-circle-fill text-success" : "bi-circle"} me-2`}></i> Add Skills</li>
                      <li><i className={`bi ${user?.experience ? "bi-check-circle-fill text-success" : "bi-circle"} me-2`}></i> Add Experience</li>
                      <li><i className={`bi ${user?.resume ? "bi-check-circle-fill text-success" : "bi-circle"} me-2`}></i> Upload Resume</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {user?.role === "Applicant" && formData.resume && !isEditing && (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">Resume</h6>
                  <div className="d-flex align-items-center justify-content-between p-3 bg-body-tertiary text-body rounded-3 border">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-link-45deg fs-4 text-primary"></i>
                      <span className="fw-medium">Resume Link</span>
                    </div>
                    <a href={formData.resume} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary rounded-pill">
                      View
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Form/Details Card */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 px-md-5 d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0">Profile Information</h4>
                {!isEditing && (
                  <button className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-medium" onClick={() => setIsEditing(true)}>
                    <i className="bi bi-pencil me-1"></i> Edit Profile
                  </button>
                )}
              </div>
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Full Name</label>
                      <input type="text" name="name" className="form-control bg-body-tertiary text-body py-2" value={formData.name} onChange={handleChange} disabled={!isEditing} required />
                    </div>
                    
                    {user?.role === "Applicant" ? (
                      <>
                        <div className="col-12">
                          <label className="form-label fw-bold small text-muted text-uppercase">Professional Bio</label>
                          <textarea name="bio" className="form-control bg-body-tertiary text-body" rows="3" value={formData.bio} onChange={handleChange} disabled={!isEditing} placeholder="Tell us about yourself..."></textarea>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-muted text-uppercase">Experience</label>
                          <input type="text" name="experience" className="form-control bg-body-tertiary text-body py-2" value={formData.experience} onChange={handleChange} disabled={!isEditing} placeholder="e.g. 3 years in MERN Stack" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-muted text-uppercase">Education</label>
                          <input type="text" name="education" className="form-control bg-body-tertiary text-body py-2" value={formData.education} onChange={handleChange} disabled={!isEditing} placeholder="e.g. B.Tech Computer Science" />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold small text-muted text-uppercase">Skills</label>
                          <input type="text" name="skills" className="form-control bg-body-tertiary text-body py-2" value={formData.skills} onChange={handleChange} disabled={!isEditing} placeholder="React, Node, Express, MongoDB" />
                        </div>
                        {isEditing && (
                          <div className="col-12">
                            <label className="form-label fw-bold small text-muted text-uppercase">Resume URL (Drive, Portfolio, etc.)</label>
                            <input type="url" name="resume" className="form-control bg-body-tertiary text-body py-2" placeholder="https://..." value={formData.resume} onChange={handleChange} disabled={!isEditing} />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="col-12">
                          <label className="form-label fw-bold small text-muted text-uppercase">Company Name</label>
                          <input type="text" name="companyName" className="form-control bg-body-tertiary text-body py-2" value={formData.companyName} onChange={handleChange} disabled={!isEditing} />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold small text-muted text-uppercase">Website</label>
                          <input type="url" name="website" className="form-control bg-body-tertiary text-body py-2" value={formData.website} onChange={handleChange} disabled={!isEditing} placeholder="https://example.com" />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold small text-muted text-uppercase">About Company</label>
                          <textarea name="aboutCompany" className="form-control bg-body-tertiary text-body" rows="4" value={formData.aboutCompany} onChange={handleChange} disabled={!isEditing}></textarea>
                        </div>
                      </>
                    )}
                  </div>

                  {isEditing && (
                    <div className="d-flex justify-content-end gap-3 mt-5">
                      <button type="button" className="btn btn-outline-secondary rounded-pill px-4 fw-medium" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary rounded-pill px-5 fw-medium" disabled={status === "loading" || uploading}>
                        {status === "loading" ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default Profile;
