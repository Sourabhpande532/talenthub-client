import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import "./CreateJob.css";
import {
  clearAIResults,
  generateJobDescription,
} from "../../features/ai/aiSlice";
import {
  createJob,
  fetchJobById,
  updateJob,
} from "../../features/jobs/jobSlice";

const CreateJob = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const todayStr = new Date().toISOString().split("T")[0];

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
    remote: false,
    status: "Active",
  });

  const { currentJob, status: jobStatus } = useSelector((state) => state.jobs);
  const { status: aiStatus } = useSelector((state) => state.ai);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      dispatch(fetchJobById(id));
    }
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && currentJob && currentJob._id === id) {
      setFormData({
        title: currentJob.title || "",
        company: currentJob.company || currentJob.companyName || "",
        experience: currentJob.experience || "",
        location: currentJob.location || "",
        employmentType: currentJob.employmentType || "",
        salary: currentJob.salary || "",
        deadline: currentJob.deadline
          ? new Date(currentJob.deadline).toISOString().split("T")[0]
          : "",
        skills: currentJob.skills ? currentJob.skills.join(", ") : "",
        description: currentJob.description || "",
        remote: Boolean(currentJob.remote),
        status: currentJob.status || "Active",
      });
    }
  }, [isEditing, currentJob, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGenerateDescription = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.skills || !formData.experience) {
      toast.error(
        "Please fill Title, Skills, and Experience to use AI Assistant.",
      );
      return;
    }

    const res = await dispatch(
      generateJobDescription({
        title: formData.title,
        skills: formData.skills,
        experience: formData.experience,
      }),
    );

    if (generateJobDescription.fulfilled.match(res)) {
      setFormData((prev) => ({ ...prev, description: res.payload }));
      toast.success("AI generated description successfully!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.salary) <= 0) {
      toast.error("Salary must be greater than 0");
      return;
    }

    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!isEditing && selectedDate < today) {
        toast.error("Application deadline cannot be in the past");
        return;
      }
    }

    const payload = {
      ...formData,
      salary: Number(formData.salary),
      remote:
        Boolean(formData.remote) ||
        formData.location.trim().toLowerCase() === "remote",
      skills:
        typeof formData.skills === "string"
          ? formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : formData.skills,
    };

    let res;
    if (isEditing) {
      res = await dispatch(updateJob({ id, jobData: payload }));
    } else {
      res = await dispatch(createJob(payload));
    }

    if (
      (isEditing && updateJob.fulfilled.match(res)) ||
      (!isEditing && createJob.fulfilled.match(res))
    ) {
      dispatch(clearAIResults());
      navigate("/dashboard");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/15 transition-all";
  const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5";

  return (
    <div className="create-job-page min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 mb-6 no-underline transition-colors"
        >
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="bg-navy-900 px-6 sm:px-8 py-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                <i className="bi bi-briefcase-fill"></i>{" "}
                {isEditing ? "Update Opportunity" : "Talent Acquisition"}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {isEditing ? "Edit Job Details" : "Create New Job"}
              </h1>
            </div>
            {isEditing && (
              <span
                className={`inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold ${
                  formData.status === "Active"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                Status: {formData.status}
              </span>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    className={inputClass}
                    placeholder="e.g. Senior React Developer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    className={inputClass}
                    placeholder="e.g. Google, Acme Inc"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Experience Required *</label>
                  <select
                    name="experience"
                    className={inputClass}
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

                <div>
                  <label className={labelClass}>Employment Type *</label>
                  <select
                    name="employmentType"
                    className={inputClass}
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

                <div>
                  <label className={labelClass}>Location *</label>
                  <input
                    type="text"
                    name="location"
                    className={inputClass}
                    placeholder="e.g. Remote, Bangalore, Hyderabad"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Salary (LPA) *</label>
                  <input
                    type="number"
                    name="salary"
                    min="1"
                    step="any"
                    className={inputClass}
                    placeholder="e.g. 15"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Application Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    min={!isEditing ? todayStr : undefined}
                    className={inputClass}
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Skills (Comma Separated) *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    className={inputClass}
                    placeholder="e.g. React, Node.js, TypeScript, MongoDB"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Remote Toggle */}
                <div className="flex items-center pt-2">
                  <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="remote"
                      checked={Boolean(formData.remote)}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-800 block">
                        Remote Friendly Role
                      </span>
                      <span className="text-xs text-slate-500">
                        Candidates can work remotely for this position
                      </span>
                    </div>
                  </label>
                </div>

                {isEditing && (
                  <div>
                    <label className={labelClass}>Listing Status</label>
                    <select
                      name="status"
                      className={inputClass}
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                )}
              </div>

              {/* AI Job Description Generator Banner */}
              <div className="rounded-2xl bg-teal-50/80 border border-teal-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 text-lg shadow-sm">
                    <i className="bi bi-magic"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      AI Job Description Generator
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Fill in Title, Experience, and Skills above, then let AI draft a structured job description.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={aiStatus === "loading"}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
                >
                  {aiStatus === "loading" ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-stars"></i> Generate with AI
                    </>
                  )}
                </button>
              </div>

              {/* Job Description Textarea */}
              <div>
                <label className={labelClass}>Job Description *</label>
                <textarea
                  name="description"
                  className={`${inputClass} min-h-[200px] leading-relaxed`}
                  rows="8"
                  placeholder="Write a comprehensive job description or click 'Generate with AI' above..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* Submit / Cancel Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors no-underline"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={jobStatus === "loading"}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-colors"
                >
                  {jobStatus === "loading"
                    ? isEditing
                      ? "Saving..."
                      : "Publishing..."
                    : isEditing
                      ? "Save Changes"
                      : "Publish Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
