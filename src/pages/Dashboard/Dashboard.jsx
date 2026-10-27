import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API_URL from "../../api/axiosHelper";
import {
  fetchDashboard,
  fetchAppliedJobs,
  fetchProfile,
  removeBookmark,
} from "../../features/user/userSlice";
import {
  fetchApplicantsForJob,
  updateApplicationStatus,
  withdrawApplication,
} from "../../features/application/applicationSlice";
import ApplicantCard from "../../components/ApplicantCard/ApplicantCard";
import AIAssistantModal from "../../components/AIAssistantModal/AIAssistantModal";
import { setUser } from "../../features/auth/authSlice";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { dashboardData, appliedJobs, status } = useSelector(
    (state) => state.user,
  );
  const { applicantsList, status: applicantsStatus } = useSelector(
    (state) => state.applications,
  );

  // Recruiter state: AI Assistant Modal & Per-Job Applicant Filter
  const [selectedJobIdForAI, setSelectedJobIdForAI] = useState("");
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState("recent");
  const [applicantStatusFilter, setApplicantStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchProfile());
    if (user?.role === "Applicant") {
      dispatch(fetchAppliedJobs());
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (
      user?.role === "Recruiter" &&
      selectedJobForApplicants &&
      selectedJobForApplicants !== "recent"
    ) {
      dispatch(fetchApplicantsForJob(selectedJobForApplicants));
    }
  }, [dispatch, user?.role, selectedJobForApplicants]);

  const handleStatusChange = (applicationId, newStatus) => {
    dispatch(
      updateApplicationStatus({ applicationId, status: newStatus }),
    ).then(() => {
      dispatch(fetchDashboard());
    });
  };

  const handleArchiveJob = async (jobId) => {
    try {
      await API_URL.patch(`/api/jobs/${jobId}/archive`);
      toast.success("Job archived successfully");
      dispatch(fetchDashboard());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to archive job");
    }
  };

  const handleActivateJob = async (jobId) => {
    try {
      await API_URL.put(`/api/jobs/${jobId}`, { status: "Active" });
      toast.success("Job activated successfully");
      dispatch(fetchDashboard());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to activate job");
    }
  };

  if (status === "loading" && !dashboardData) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center p-6">
        <span className="inline-block w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></span>
        <p className="text-sm font-medium text-slate-500">
          Loading your workspace...
        </p>
      </div>
    );
  }

  const renderRecruiterDashboard = () => {
    const stats = dashboardData?.stats || {};
    const recentApplications = dashboardData?.recentApplications || [];
    const myJobs = dashboardData?.myJobs || [];
    const activeJobs = myJobs.filter((job) => job.status === "Active");
    const archivedJobs = myJobs.filter((job) => job.status === "Archived");

    const selectedAIJob = myJobs.find((j) => j._id === selectedJobIdForAI);
    const selectedApplicantsJob = myJobs.find(
      (j) => j._id === selectedJobForApplicants,
    );

    const baseApplicants =
      selectedJobForApplicants === "recent"
        ? recentApplications
        : applicantsList || [];

    const displayedApplicants =
      applicantStatusFilter === "All"
        ? baseApplicants
        : baseApplicants.filter((app) => app.status === applicantStatusFilter);

    return (
      <div className="recruiter-dashboard space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-2">
              <i className="bi bi-building-check"></i> Recruiter Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recruiter Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your job postings, evaluate applicants, and track hiring metrics.
            </p>
          </div>
          <Link
            to="/create-job"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            <i className="bi bi-plus-lg"></i> Post New Job
          </Link>
        </div>

        {/* Summary Cards (Active Jobs, Archived Jobs, Total Applications, Total Shortlisted) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Active Jobs",
              value: stats.activeJobs || 0,
              icon: "bi-briefcase-fill",
              iconBg: "bg-teal-50 text-teal-600 border-teal-100",
            },
            {
              label: "Archived Jobs",
              value: stats.archivedJobs || 0,
              icon: "bi-archive-fill",
              iconBg: "bg-slate-100 text-slate-600 border-slate-200",
            },
            {
              label: "Total Applications",
              value: stats.totalApplications || 0,
              icon: "bi-file-earmark-person-fill",
              iconBg: "bg-navy-50 text-navy-800 border-navy-100",
            },
            {
              label: "Total Shortlisted",
              value: stats.totalShortlisted || 0,
              icon: "bi-check-circle-fill",
              iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl shrink-0 ${stat.iconBg}`}
              >
                <i className={`bi ${stat.icon}`}></i>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  {stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* AI Hiring Assistant Banner */}
        <div className="bg-navy-900 rounded-2xl p-6 text-white shadow-card border border-navy-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 text-xl shrink-0">
              <i className="bi bi-stars"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Hiring Assistant
              </h2>
              <p className="text-sm text-slate-300 mt-0.5">
                Select one of your job postings to ask our AI copilot to rank, compare, or summarize candidates.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto lg:min-w-[420px]">
            <select
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-400"
              onChange={(e) => setSelectedJobIdForAI(e.target.value)}
              value={selectedJobIdForAI}
              aria-label="Select a Job for AI Assistant"
            >
              <option value="">Select a Job...</option>
              {myJobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.status})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                if (!selectedJobIdForAI) {
                  toast.error("Please select a job first");
                  return;
                }
                setIsAIModalOpen(true);
              }}
              disabled={!selectedJobIdForAI}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="bi bi-magic"></i> Ask AI
            </button>
          </div>
        </div>

        {/* My Active Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              My Active Jobs
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {activeJobs.length}
              </span>
            </h2>
          </div>

          {activeJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-base font-bold text-slate-900 hover:text-teal-600 transition-colors no-underline"
                      >
                        {job.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <i className="bi bi-geo-alt text-teal-600"></i>
                          {job.location}
                        </span>
                        {job.employmentType && (
                          <span className="inline-flex items-center gap-1">
                            <i className="bi bi-briefcase text-slate-400"></i>
                            {job.employmentType}
                          </span>
                        )}
                        {job.salary && (
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            ₹{job.salary} LPA
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobForApplicants(job._id);
                        const el = document.getElementById("applicants-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <i className="bi bi-people"></i> View Applicants
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/edit-job/${job._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors no-underline"
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleArchiveJob(job._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                      >
                        <i className="bi bi-archive"></i> Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
              <p className="text-slate-500 text-sm mb-3">
                You don't have any active job listings right now.
              </p>
              <Link
                to="/create-job"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 no-underline"
              >
                <i className="bi bi-plus-circle"></i> Post your first job
              </Link>
            </div>
          )}
        </div>

        {/* My Archived Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              My Archived Jobs
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {archivedJobs.length}
              </span>
            </h2>
          </div>

          {archivedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {archivedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-slate-50/80 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-700">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <i className="bi bi-geo-alt"></i> {job.location}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-700">
                      <i className="bi bi-archive"></i> Archived
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200/70">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobForApplicants(job._id);
                        const el = document.getElementById("applicants-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <i className="bi bi-people"></i> View Applicants
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/edit-job/${job._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-colors no-underline"
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleActivateJob(job._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                      >
                        <i className="bi bi-check2-circle"></i> Activate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center">
              <p className="text-slate-500 text-sm mb-0">
                No archived jobs.
              </p>
            </div>
          )}
        </div>

        {/* Applicants View Section */}
        <div id="applicants-section" className="pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {selectedJobForApplicants === "recent"
                  ? "Recent Applications"
                  : `Applicants for: ${selectedApplicantsJob?.title || "Selected Job"}`}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review candidate profiles, resumes, skills, application dates, and update statuses cleanly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Job Filter Dropdown */}
              <select
                value={selectedJobForApplicants}
                onChange={(e) => setSelectedJobForApplicants(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-600"
                aria-label="Filter applicants by job"
              >
                <option value="recent">Recent Applications (Overview)</option>
                {myJobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    Job: {job.title}
                  </option>
                ))}
              </select>

              {/* Status Filter Pills */}
              <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1">
                {["All", "New", "Shortlisted", "Rejected"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setApplicantStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      applicantStatusFilter === st
                        ? "bg-navy-900 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st === "New" ? "Applied" : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {applicantsStatus === "loading" &&
          selectedJobForApplicants !== "recent" ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <span className="inline-block w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-2"></span>
              <p className="text-sm text-slate-500">Loading applicants...</p>
            </div>
          ) : displayedApplicants.length > 0 ? (
            <div className="space-y-3">
              {displayedApplicants.map((app) => (
                <ApplicantCard
                  key={app._id}
                  application={app}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl">
                <i className="bi bi-inbox"></i>
              </div>
              <p className="text-slate-600 font-semibold text-sm mb-1">
                No matching applications found
              </p>
              <p className="text-xs text-slate-400 mb-0">
                {applicantStatusFilter !== "All"
                  ? `No applications with status "${applicantStatusFilter}".`
                  : "Applications submitted by candidates will appear here."}
              </p>
            </div>
          )}
        </div>

        {/* AI Hiring Assistant Modal */}
        <AIAssistantModal
          jobId={selectedJobIdForAI}
          jobTitle={selectedAIJob?.title}
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
        />
      </div>
    );
  };

  const renderApplicantDashboard = () => {
    const stats = dashboardData?.stats || {};
    const recentActivity = dashboardData?.recentActivity || [];

    const sortedAppliedJobs = [...(appliedJobs || [])].sort((a, b) => {
      const compA = (a.job?.company || a.job?.companyName || "").toLowerCase();
      const compB = (b.job?.company || b.job?.companyName || "").toLowerCase();
      return compA.localeCompare(compB);
    });

    const getStatusBadgeClasses = (appStatus) => {
      switch (appStatus) {
        case "Shortlisted":
          return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "Rejected":
          return "bg-rose-50 text-rose-700 border-rose-200";
        case "Withdrawn":
          return "bg-amber-50 text-amber-700 border-amber-200";
        default:
          return "bg-teal-50 text-teal-700 border-teal-200";
      }
    };

    return (
      <div className="applicant-dashboard space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-2">
              <i className="bi bi-person-workspace"></i> Candidate Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track your job applications, saved roles, and real-time hiring updates.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold transition-colors no-underline"
          >
            <i className="bi bi-search"></i> Find More Jobs
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Applied Jobs",
              value: stats.applied || 0,
              icon: "bi-send-check-fill",
              iconBg: "bg-teal-50 text-teal-600 border-teal-100",
            },
            {
              label: "Shortlisted",
              value: stats.shortlisted || 0,
              icon: "bi-star-fill",
              iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
            },
            {
              label: "Rejected",
              value: stats.rejected || 0,
              icon: "bi-x-circle-fill",
              iconBg: "bg-rose-50 text-rose-600 border-rose-100",
            },
            {
              label: "Bookmarked",
              value: user?.bookmarks?.length ?? stats.bookmarked ?? 0,
              icon: "bi-bookmark-heart-fill",
              iconBg: "bg-amber-50 text-amber-600 border-amber-100",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {stat.value}
                </h2>
              </div>
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl ${stat.iconBg}`}
              >
                <i className={`bi ${stat.icon}`}></i>
              </div>
            </div>
          ))}
        </div>

        {/* My Applications List */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Applications
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All roles you have applied for and their current review stage
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {sortedAppliedJobs.length} Total
            </span>
          </div>

          <div className="p-4 sm:p-6">
            {sortedAppliedJobs && sortedAppliedJobs.length > 0 ? (
              <>
                {/* Mobile Responsive Cards (< md) */}
                <div className="md:hidden space-y-3">
                  {sortedAppliedJobs.map((app) => {
                    const companyName =
                      app.job?.company ||
                      app.job?.companyName ||
                      (app.job?.recruiter && app.job.recruiter.companyName) ||
                      "Company";
                    return (
                      <div
                        key={app._id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              to={`/jobs/${app.job?._id}`}
                              className="text-sm font-bold text-slate-900 hover:text-teal-600 no-underline block truncate"
                            >
                              {app.job?.title || "Unknown Role"}
                            </Link>
                            <p className="text-xs font-medium text-slate-500 mt-0.5 mb-0">
                              {companyName}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${getStatusBadgeClasses(
                              app.status,
                            )}`}
                          >
                            {app.status === "New" ? "Applied" : app.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 text-xs">
                          <span className="text-slate-500">
                            Applied:{" "}
                            {new Date(
                              app.appliedAt || app.createdAt,
                            ).toLocaleDateString()}
                          </span>
                          {app.status === "Withdrawn" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                              Withdrawn
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                              onClick={async () => {
                                const res = await dispatch(
                                  withdrawApplication(app._id),
                                );
                                if (withdrawApplication.fulfilled.match(res)) {
                                  dispatch(fetchAppliedJobs());
                                  dispatch(fetchDashboard());
                                }
                              }}
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop & Tablet Table (md+) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="pb-3 pr-4">Job Title</th>
                        <th className="pb-3 px-4">Company</th>
                        <th className="pb-3 px-4">Applied On</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {sortedAppliedJobs.map((app) => {
                        const companyName =
                          app.job?.company ||
                          app.job?.companyName ||
                          (app.job?.recruiter &&
                            app.job.recruiter.companyName) ||
                          "Company";
                        return (
                          <tr
                            key={app._id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-4 pr-4 font-semibold">
                              <Link
                                to={`/jobs/${app.job?._id}`}
                                className="text-slate-900 hover:text-teal-600 transition-colors no-underline"
                              >
                                {app.job?.title || "Unknown Role"}
                              </Link>
                            </td>
                            <td className="py-4 px-4 text-slate-600 font-medium">
                              {companyName}
                            </td>
                            <td className="py-4 px-4 text-slate-500">
                              {new Date(
                                app.appliedAt || app.createdAt,
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClasses(
                                  app.status,
                                )}`}
                              >
                                {app.status === "New" ? "Applied" : app.status}
                              </span>
                            </td>
                            <td className="py-4 pl-4 text-right">
                              {app.status === "Withdrawn" ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                                  Withdrawn
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                                  onClick={async () => {
                                    const res = await dispatch(
                                      withdrawApplication(app._id),
                                    );
                                    if (
                                      withdrawApplication.fulfilled.match(res)
                                    ) {
                                      dispatch(fetchAppliedJobs());
                                      dispatch(fetchDashboard());
                                    }
                                  }}
                                >
                                  Withdraw
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm mb-3">
                  You haven't applied to any jobs yet.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 no-underline"
                >
                  Explore open roles <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bookmarked Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="bi bi-bookmark-heart text-teal-600"></i>
              Bookmarked Jobs
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {user?.bookmarks?.length || 0} Saved
            </span>
          </div>

          <div className="p-6">
            {user?.bookmarks && user.bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.bookmarks.map((job) => {
                  const jobId = typeof job === "string" ? job : job._id;
                  const title =
                    typeof job === "object" && job.title
                      ? job.title
                      : "Saved Job Opportunity";
                  const company =
                    typeof job === "object"
                      ? job.company || job.companyName || "Hiring Company"
                      : "View details to see company";
                  const location =
                    typeof job === "object" && job.location ? job.location : null;

                  return (
                    <div
                      key={jobId}
                      className="rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-teal-300 transition-colors bg-slate-50/40"
                    >
                      <div>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                          {title}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                          {company}
                        </p>
                        {location && (
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <i className="bi bi-geo-alt text-teal-600"></i>{" "}
                            {location}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/70">
                        <Link
                          to={`/jobs/${jobId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors no-underline"
                        >
                          View Details
                        </Link>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1"
                          onClick={async () => {
                            const res = await dispatch(removeBookmark(jobId));
                            if (removeBookmark.fulfilled.match(res)) {
                              dispatch(setUser(res.payload));
                              dispatch(fetchDashboard());
                            }
                          }}
                        >
                          <i className="bi bi-trash"></i> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm mb-0">
                  No bookmarked jobs in your Bookmarks yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>
          </div>

          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 ml-2">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="relative">
                    <span
                      className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        activity.type === "Shortlisted"
                          ? "bg-emerald-500"
                          : activity.type === "Rejected"
                            ? "bg-rose-500"
                            : activity.type === "Withdrawn"
                              ? "bg-amber-500"
                              : "bg-teal-600"
                      }`}
                    ></span>
                    <p className="text-sm text-slate-700 mb-1">
                      {activity.type === "Applied" && (
                        <>
                          Applied for{" "}
                          <strong className="font-semibold text-slate-900">
                            {activity.jobTitle}
                          </strong>{" "}
                          at {activity.companyName}
                        </>
                      )}
                      {activity.type === "Shortlisted" && (
                        <>
                          <strong className="text-emerald-700">
                            Congratulations!
                          </strong>{" "}
                          You were shortlisted for{" "}
                          <strong className="font-semibold text-slate-900">
                            {activity.jobTitle}
                          </strong>{" "}
                          at {activity.companyName}
                        </>
                      )}
                      {activity.type === "Rejected" && (
                        <>
                          Your application for{" "}
                          <strong className="font-semibold text-slate-900">
                            {activity.jobTitle}
                          </strong>{" "}
                          at {activity.companyName} was not selected.
                        </>
                      )}
                      {activity.type === "Withdrawn" && (
                        <>
                          Withdrew application for{" "}
                          <strong className="font-semibold text-slate-900">
                            {activity.jobTitle}
                          </strong>{" "}
                          at {activity.companyName}
                        </>
                      )}
                      {activity.type === "Bookmarked" && (
                        <>
                          Bookmarked{" "}
                          <strong className="font-semibold text-slate-900">
                            {activity.jobTitle}
                          </strong>{" "}
                          at {activity.companyName}
                        </>
                      )}
                    </p>
                    <span className="text-xs text-slate-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <i className="bi bi-activity text-3xl mb-2 block"></i>
                <p className="text-sm mb-0">No recent activity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-page min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {user?.role === "Recruiter"
          ? renderRecruiterDashboard()
          : renderApplicantDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
