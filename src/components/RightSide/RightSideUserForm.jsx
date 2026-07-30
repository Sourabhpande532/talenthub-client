import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
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
  const [uploading, setUploading] = useState(false);
  const { status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "onn57svg");

    try {
      setUploading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/djqf9vhkq/image/upload",
        {
          method: "POST",
          body: data,
        },
      );
      const cloudData = await res.json();
      if (!res.ok) throw new Error(cloudData.error?.message || "Upload failed");

      setFormData({ ...formData, resume: cloudData.secure_url });
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error(error.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };
  return {
    formData,
    uploading,
    status,
    dispatch,
    navigate,
    handleChange,
    handleFileUpload,
  };
}

export const RightSideUserForm = ({ role, setRole }) => {
  const {
    formData,
    uploading,
    status,
    dispatch,
    navigate,
    handleChange,
    handleFileUpload,
  } = useRegistration();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      payload.experience = formData.experience;
      payload.location = formData.location;
      payload.skills = formData.skills.split(",").map((s) => s.trim());
      payload.resume = formData.resume;
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
    <div className='col-lg-8 p-4 p-md-5'>
      {/* Mobile Role Switcher (Hidden on LG) */}
      <div className='d-lg-none mb-4'>
        <h3 className='fw-bold mb-3'>Create your account</h3>
        <div className='btn-group w-100 shadow-sm' role='group'>
          <input
            type='radio'
            className='btn-check'
            name='role'
            id='roleApp'
            checked={role === "Applicant"}
            onChange={() => setRole("Applicant")}
          />
          <label className='btn btn-outline-primary' htmlFor='roleApp'>
            Applicant
          </label>

          <input
            type='radio'
            className='btn-check'
            name='role'
            id='roleRec'
            checked={role === "Recruiter"}
            onChange={() => setRole("Recruiter")}
          />
          <label className='btn btn-outline-primary' htmlFor='roleRec'>
            Recruiter
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='row g-3'>
          <div className='col-md-6'>
            <label className='form-label fw-medium small text-muted'>
              Full Name
            </label>
            <input
              type='text'
              name='name'
              className='form-control bg-body-tertiary text-body'
              placeholder='Enter your full name'
              onChange={handleChange}
              required
            />
          </div>

          <div className='col-md-6'>
            <label className='form-label fw-medium small text-muted'>
              Email Address
            </label>
            <input
              type='email'
              name='email'
              className='form-control bg-body-tertiary text-body'
              placeholder='Enter your email'
              onChange={handleChange}
              required
            />
          </div>

          <div className='col-md-6'>
            <label className='form-label fw-medium small text-muted'>
              Password
            </label>
            <input
              type='password'
              name='password'
              className='form-control bg-body-tertiary text-body'
              placeholder='Create a password'
              onChange={handleChange}
              required
            />
          </div>

          <div className='col-md-6'>
            <label className='form-label fw-medium small text-muted'>
              Confirm Password
            </label>
            <input
              type='password'
              name='confirmPassword'
              className='form-control bg-body-tertiary text-body'
              placeholder='Confirm your password'
              onChange={handleChange}
              required
            />
          </div>

          {role === "Applicant" ? (
            <>
              <div className='col-md-6'>
                <label className='form-label fw-medium small text-muted'>
                  Experience
                </label>
                <select
                  name='experience'
                  className='form-select bg-body-tertiary text-body'
                  onChange={handleChange}
                  required>
                  <option value=''>Select your experience</option>
                  <option value='Fresher'>Fresher (0 years)</option>
                  <option value='1-3 Yrs'>1 - 3 Years</option>
                  <option value='3-5 Yrs'>3 - 5 Years</option>
                  <option value='5+ Yrs'>5+ Years</option>
                </select>
              </div>

              <div className='col-md-6'>
                <label className='form-label fw-medium small text-muted'>
                  Current Location
                </label>
                <input
                  type='text'
                  name='location'
                  className='form-control bg-body-tertiary text-body'
                  placeholder='e.g. Bangalore, India'
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-12'>
                <label className='form-label fw-medium small text-muted'>
                  Skills (Optional)
                </label>
                <input
                  type='text'
                  name='skills'
                  className='form-control bg-body-tertiary text-body'
                  placeholder='e.g. React, Node.js, SQL (Comma separated)'
                  onChange={handleChange}
                />
              </div>

              <div className='col-12'>
                <label className='form-label fw-medium small text-muted'>
                  Upload Resume (Optional)
                </label>
                <div className='d-flex align-items-center gap-3'>
                  <input
                    type='file'
                    className='form-control bg-body-tertiary text-body'
                    accept='.pdf,.doc,.docx'
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className='spinner-border spinner-border-sm text-primary'></div>
                  )}
                </div>
                {formData.resume && (
                  <small className='text-success'>
                    <i className='bi bi-check-circle me-1'></i>Resume uploaded
                  </small>
                )}
              </div>
            </>
          ) : (
            <div className='col-12'>
              <label className='form-label fw-medium small text-muted'>
                Company Name
              </label>
              <input
                type='text'
                name='companyName'
                className='form-control bg-body-tertiary text-body'
                placeholder='Enter company name'
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>

        <div className='form-check mt-4 mb-4'>
          <input
            type='checkbox'
            className='form-check-input'
            id='termsCheck'
            required
          />
          <label
            className='form-check-label text-muted small'
            htmlFor='termsCheck'>
            I agree to the{" "}
            <a href='#!' className='text-decoration-none fw-medium'>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href='#!' className='text-decoration-none fw-medium'>
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type='submit'
          className='btn btn-primary btn-lg w-100 rounded-3 fw-medium'
          disabled={status === "loading" || uploading}>
          {status === "loading" ? (
            <span className='spinner-border spinner-border-sm me-2'></span>
          ) : null}
          Create Account
        </button>
      </form>
    </div>
  );
};
