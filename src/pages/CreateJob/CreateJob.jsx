/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import "./CreateJob.css";
import { clearAIResults, generateJobDescription } from "../../features/ai/aiSlice";
import { createJob } from "../../features/jobs/jobSlice";

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    experience: "",
    location: "",
    employmentType: "",
    salary: "",
    deadline: "",
    skills: "",
    description: "",
  });

  const { status: jobStatus } = useSelector((state) => state.jobs);
  const { jobDescriptionResult, status: aiStatus } = useSelector((state) => state.ai);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.skills || !formData.experience) {
      toast.error("Please fill Title, Skills, and Experience to use AI Assistant.");
      return;
    }
    
    const res = await dispatch(generateJobDescription({
      title: formData.title,
      skills: formData.skills,
      experience: formData.experience
    }));
    
    if (generateJobDescription.fulfilled.match(res)) {
      setFormData(prev => ({ ...prev, description: res.payload }));
      toast.success("AI generated description successfully!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Number(formData.salary) <= 0) {
      toast.error("Salary must be greater than 0");
      return;
    }

    const payload = {
      ...formData,
      skills: formData.skills.split(",").map(s => s.trim()).filter(s => s)
    };

    const res = await dispatch(createJob(payload));
    if (createJob.fulfilled.match(res)) {
      dispatch(clearAIResults());
      navigate("/dashboard");
    }
  };

  return (
    <div className="create-job-page bg-body-tertiary min-vh-100 py-4">
      <div className="container">
        <Link to="/dashboard" className="text-decoration-none text-muted mb-4 d-inline-block fw-medium">
          <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
        </Link>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-4 pb-0 px-4 px-md-5 d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0">Create New Job</h4>
              </div>
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  
                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Job Title *</label>
                      <input 
                        type="text" 
                        name="title" 
                        className="form-control bg-light py-2" 
                        placeholder="e.g. Senior React Developer" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Company Name *</label>
                      <input 
                        type="text" 
                        name="company" 
                        className="form-control bg-light py-2" 
                        placeholder="e.g. Google, Acme Inc" 
                        value={formData.company} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Experience Required *</label>
                      <select 
                        name="experience" 
                        className="form-select bg-light py-2" 
                        value={formData.experience} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="1-3 Yrs">1-3 Yrs</option>
                        <option value="3-5 Yrs">3-5 Yrs</option>
                        <option value="5+ Yrs">5+ Yrs</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Employment Type *</label>
                      <select 
                        name="employmentType" 
                        className="form-select bg-light py-2" 
                        value={formData.employmentType} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Select type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Location *</label>
                      <input 
                        type="text" 
                        name="location" 
                        className="form-control bg-light py-2" 
                        placeholder="e.g. Remote, Bangalore" 
                        value={formData.location} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Salary (LPA) *</label>
                      <input 
                        type="number" 
                        name="salary" 
                        className="form-control bg-light py-2" 
                        placeholder="e.g. 15" 
                        value={formData.salary} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Application Deadline *</label>
                      <input 
                        type="date" 
                        name="deadline" 
                        className="form-control bg-light py-2" 
                        value={formData.deadline} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Skills *</label>
                      <input 
                        type="text" 
                        name="skills" 
                        className="form-control bg-light py-2" 
                        placeholder="e.g. React, Node (Comma separated)" 
                        value={formData.skills} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>

                  {/* AI Assistant Banner */}
                  <div className="ai-banner bg-primary-subtle text-primary p-4 rounded-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border border-primary-subtle">
                    <div>
                      <h6 className="fw-bold mb-1"><i className="bi bi-magic me-2"></i>AI Job Description Generator</h6>
                      <p className="mb-0 small opacity-75">Fill Title, Experience, and Skills, then let AI write a professional description for you.</p>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-primary rounded-pill fw-medium text-nowrap px-4"
                      onClick={handleGenerateDescription}
                      disabled={aiStatus === "loading"}
                    >
                      {aiStatus === "loading" ? "Generating..." : "Generate with AI"}
                    </button>
                  </div>

                  <div className="mb-5">
                    <label className="form-label fw-bold">Job Description *</label>
                    <textarea 
                      name="description" 
                      className="form-control bg-light" 
                      rows="8" 
                      placeholder="Write job description or use AI generator..." 
                      value={formData.description} 
                      onChange={handleChange} 
                      required
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-3">
                    <Link to="/dashboard" className="btn btn-outline-secondary fw-medium px-4 rounded-pill">
                      Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className="btn btn-primary fw-medium px-5 rounded-pill"
                      disabled={jobStatus === "loading"}
                    >
                      {jobStatus === "loading" ? "Publishing..." : "Publish Job"}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
