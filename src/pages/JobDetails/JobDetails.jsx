import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { clearCurrentJob, fetchJobById } from "../../features/jobs/jobSlice";
import {
  addBookmark,
  fetchAppliedJobs,
  removeBookmark,
} from "../../features/user/userSlice";
import {
  clearAIResults,
  generateInterviewPrep,
} from "../../features/ai/aiSlice";
import toast from "react-hot-toast";
import {
  applyToJob,
  withdrawApplication,
} from "../../features/application/applicationSlice";
import JobCard from "../../components/JobCard/JobCard";
import { MarkdownRenderer } from "../../components/MarkdownRenderer/MarkdownRenderer";
import { setUser } from "../../features/auth/authSlice";
import {
  normalizeOptionalUrl,
  resolveImageUrl,
} from "../../utils/urlHelper";
import "./JobDetails.css";

const formatExperience = (exp) => {
  if (!exp) return "";
  if (exp.toLowerCase() === "fresher") return "Fresher";
  if (exp.toLowerCase().includes("yr") || exp.toLowerCase().includes("year")) {
    return exp;
  }
  return `${exp} Yrs`;
};

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentJob, currentJobStatus, similarJobs } = useSelector(
    (state) => state.jobs,
  );
  const { user, token } = useSelector((state) => state.auth);
  const { appliedJobs } = useSelector((state) => state.user);
  const { status: applyStatus } = useSelector((state) => state.applications);
  const { interviewPrepResult, status: aiStatus } = useSelector(
    (state) => state.ai,
  );

  // Local state to check if the current applicant has an active (non-withdrawn) application
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [wasWithdrawn, setWasWithdrawn] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isBookmarked = user?.bookmarks?.some(
    (b) => (typeof b === "string" ? b : b?._id) === id,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(fetchJobById(id));
    if (token && user?.role === "Applicant") {
      dispatch(fetchAppliedJobs());
    }
    return () => {
      dispatch(clearCurrentJob());
      dispatch(clearAIResults());
    };
  }, [dispatch, id, token, user?.role]);

  useEffect(() => {
    setLogoError(false);
  }, [currentJob?.recruiter?.companyLogo]);

  useEffect(() => {
    if (Array.isArray(appliedJobs) && id) {
      const matchApp = appliedJobs.find(
        (app) => (app.job?._id || app.job) === id,
      );
      if (matchApp && matchApp.status !== "Withdrawn") {
        setHasApplied(true);
        setApplicationId(matchApp._id);
        setApplicationStatus(matchApp.status);
        setWasWithdrawn(false);
      } else if (matchApp && matchApp.status === "Withdrawn") {
        setHasApplied(false);
        setApplicationId(null);
        setApplicationStatus("Withdrawn");
        setWasWithdrawn(true);
      } else {
        setHasApplied(false);
        setApplicationId(null);
        setApplicationStatus(null);
        setWasWithdrawn(false);
      }
    }
  }, [appliedJobs, id]);

  const handleApply = async () => {
    if (!token) return toast.error("Please login to apply");
    if (user?.role === "Recruiter")
      return toast.error("Recruiters cannot apply for jobs");

    const res = await dispatch(
      applyToJob({ jobId: id, resume: user?.resume || "" }),
    );
    if (applyToJob.fulfilled.match(res)) {
      setHasApplied(true);
      setApplicationId(res.payload?.data?._id);
      setApplicationStatus(res.payload?.data?.status || "New");
      setWasWithdrawn(false);
      dispatch(fetchAppliedJobs());
    }
  };

  const handleWithdraw = async () => {
    if (!applicationId) return toast.error("Application ID not found");
    const res = await dispatch(withdrawApplication(applicationId));
    if (withdrawApplication.fulfilled.match(res)) {
      setHasApplied(false);
      setApplicationId(null);
      setApplicationStatus("Withdrawn");
      setWasWithdrawn(true);
      dispatch(fetchAppliedJobs());
    }
  };

  const handleBookmarkToggle = async () => {
    if (!token) return toast.error("Please login to bookmark jobs");
    if (user?.role === "Recruiter") return;

    if (isBookmarked) {
      const res = await dispatch(removeBookmark(id));
      if (removeBookmark.fulfilled.match(res)) {
        dispatch(setUser(res.payload));
      }
    } else {
      const res = await dispatch(addBookmark(id));
      if (addBookmark.fulfilled.match(res)) {
        dispatch(setUser(res.payload));
      }
    }
  };

  const handleGeneratePrep = () => {
    dispatch(generateInterviewPrep(id));
  };

  if (currentJobStatus === "loading") {
    return (
      <div className="flex-1 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50">
        <div
          className="w-10 h-10 border-4 border-slate-200 border-t-navy-900 rounded-full animate-spin"
          role="status"></div>
        <p className="mt-3 text-sm font-medium text-slate-600">
          Loading job details...
        </p>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="flex-1 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center text-2xl mb-3">
          <i className="bi bi-briefcase"></i>
        </div>
        <h2 className="font-display text-xl font-bold text-slate-900 mb-1">
          Job not found
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          This listing may have been archived or removed.
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-900 text-white text-sm font-semibold no-underline">
          <i className="bi bi-arrow-left"></i>
          <span>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  const companyName =
    currentJob.company ||
    currentJob.companyName ||
    currentJob.recruiter?.companyName ||
    "Company";
  const isOwnRecruiterJob =
    user?.role === "Recruiter" &&
    currentJob.recruiter &&
    (currentJob.recruiter._id === user._id ||
      currentJob.recruiter === user._id);
  const companyLogo = resolveImageUrl(
    currentJob.recruiter?.companyLogo ||
      (isOwnRecruiterJob ? user?.companyLogo : ""),
  );
  const companyWebsite = normalizeOptionalUrl(currentJob.recruiter?.website);

  const cleanSkills = Array.isArray(currentJob.skills)
    ? currentJob.skills
        .flatMap((s) => (typeof s === "string" ? s.split(",") : []))
        .map((s) => s.replace(/,$/, "").trim())
        .filter(Boolean)
    : [];

  const isRemote =
    Boolean(currentJob.remote) ||
    (currentJob.location &&
      currentJob.location.toLowerCase().includes("remote"));

  return (
    <main className="job-details-page flex-1 bg-slate-50 min-h-[calc(100vh-4rem)] py-5 sm:py-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Jobs Navigation Button */}
        <div className="mb-4 sm:mb-5">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-navy-900 border border-slate-200 text-sm font-semibold shadow-sm transition-colors no-underline">
            <i className="bi bi-arrow-left text-brand-600"></i>
            <span>Back to Jobs</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left / Main Content Column */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6 min-w-0">
            {/* Primary Job Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 sm:p-7 md:p-8">
              {/* Role Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4 pb-5 sm:pb-6 border-b border-slate-100">
                {companyLogo && !logoError ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 flex-shrink-0"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-navy-900 text-white font-display font-bold text-xl sm:text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {companyName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 break-words">
                      {companyName}
                    </span>
                    {currentJob.employmentType && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {currentJob.employmentType}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        isRemote
                          ? "bg-brand-50 text-brand-700 border-brand-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                      {isRemote ? "Remote" : "On-site"}
                    </span>
                  </div>
                  <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight break-words m-0">
                    {currentJob.title}
                  </h1>
                </div>
              </div>

              {/* Key Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-4 sm:py-5 border-b border-slate-100">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 m-0">
                    Compensation
                  </p>
                  <p className="text-sm sm:text-base font-bold text-emerald-700 mt-1 mb-0 flex items-center">
                    <i className="bi bi-currency-rupee"></i>
                    <span>{currentJob.salary} LPA</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 m-0">
                    Experience
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-1 mb-0">
                    <i className="bi bi-briefcase text-slate-400 mr-1.5 text-xs"></i>
                    {formatExperience(currentJob.experience)}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 m-0">
                    Location
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-1 mb-0 break-words">
                    <i className="bi bi-geo-alt text-slate-400 mr-1 text-xs"></i>
                    {currentJob.location}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 m-0">
                    Apply Before
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-1 mb-0">
                    <i className="bi bi-calendar-event text-slate-400 mr-1.5 text-xs"></i>
                    {currentJob.deadline
                      ? new Date(currentJob.deadline).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "Open"}
                  </p>
                </div>
              </div>

              {/* Job Description */}
              <div className="py-5 sm:py-6 border-b border-slate-100">
                <h2 className="font-display text-lg font-bold text-slate-900 mb-3">
                  Job Description
                </h2>
                <div className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  <pre className="m-0 whitespace-pre-wrap break-words font-sans">
                    {currentJob.description || "No description provided."}
                  </pre>
                </div>
              </div>

              {/* Required Skills */}
              <div className="pt-5 sm:pt-6">
                <h2 className="font-display text-lg font-bold text-slate-900 mb-3">
                  Skills Required
                </h2>
                {cleanSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cleanSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-200/90 break-words">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 m-0">
                    No specific skills listed.
                  </p>
                )}
              </div>
            </div>

            {/* ✨ AI Interview Preparation Section (Applicant) */}
            {user?.role === "Applicant" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
                <div className="bg-navy-900 text-white p-4 sm:px-7 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                      <i className="bi bi-robot text-lg"></i>
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-base sm:text-lg font-bold text-white leading-snug m-0">
                        AI Interview Preparation
                      </h2>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5 m-0 break-words">
                        5 likely interview questions, topics to revise &
                        preparation tips for {currentJob.title}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGeneratePrep}
                    disabled={aiStatus === "loading"}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 flex-shrink-0 shadow-sm">
                    {aiStatus === "loading" ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-stars"></i>
                        <span>
                          {interviewPrepResult
                            ? "Regenerate Guide"
                            : "Generate Guide"}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 sm:p-7">
                  {aiStatus === "idle" && !interviewPrepResult && (
                    <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <i className="bi bi-magic text-2xl text-brand-600 block mb-2"></i>
                      <p className="text-sm text-slate-600 max-w-md mx-auto m-0">
                        Click <strong>Generate Guide</strong> to receive 5
                        role-specific technical questions, revision topics, and
                        actionable interview tips tailored to{" "}
                        <strong>{companyName}</strong>.
                      </p>
                    </div>
                  )}

                  {aiStatus === "loading" && (
                    <div className="text-center py-10">
                      <div
                        className="w-9 h-9 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mx-auto"
                        role="status"></div>
                      <p className="mt-3 text-sm font-medium text-slate-600 m-0">
                        Analyzing job requirements and generating your interview
                        preparation guide...
                      </p>
                    </div>
                  )}

                  {aiStatus === "succeeded" && interviewPrepResult && (
                    <div className="ai-response p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed">
                      <MarkdownRenderer content={interviewPrepResult} />
                    </div>
                  )}

                  {aiStatus === "failed" && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span>
                        <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                        Failed to generate AI preparation. Please try again.
                      </span>
                      <button
                        type="button"
                        onClick={handleGeneratePrep}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 self-start sm:self-auto">
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-5">
              {/* Apply Action Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-1">
                  Interested in this job?
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Submit your application directly to the hiring team at{" "}
                  {companyName}.
                </p>

                {user?.role === "Applicant" ? (
                  <div className="space-y-3">
                    {hasApplied ? (
                      <>
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <i className="bi bi-check-circle-fill text-emerald-600"></i>
                            <span>Application Submitted</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white text-emerald-700 font-semibold border border-emerald-200">
                            {applicationStatus === "New"
                              ? "Applied"
                              : applicationStatus || "Applied"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleWithdraw}
                          disabled={applyStatus === "loading"}
                          className="w-full py-3 px-4 rounded-xl border border-red-300 bg-white hover:bg-red-50 text-red-600 font-semibold text-sm transition-colors">
                          {applyStatus === "loading"
                            ? "Processing..."
                            : "Withdraw Application"}
                        </button>
                      </>
                    ) : (
                      <>
                        {wasWithdrawn && (
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                            <i className="bi bi-info-circle mr-1.5"></i>
                            You previously withdrew this application. You can
                            apply again below.
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={handleApply}
                          disabled={applyStatus === "loading"}
                          className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-semibold text-sm shadow-sm transition-colors">
                          {applyStatus === "loading"
                            ? "Applying..."
                            : "Apply Now"}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleBookmarkToggle}
                      className={`w-full py-2.5 px-4 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                        isBookmarked
                          ? "bg-brand-50 border-brand-300 text-brand-800"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                      }`}>
                      <i
                        className={`bi ${
                          isBookmarked ? "bi-bookmark-fill" : "bi-bookmark"
                        }`}></i>
                      <span>{isBookmarked ? "Bookmarked" : "Save Job"}</span>
                    </button>
                  </div>
                ) : user?.role === "Recruiter" ? (
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs text-center font-medium">
                    Recruiters cannot apply to jobs.
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center no-underline">
                    Login to Apply
                  </Link>
                )}

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    <i className="bi bi-calendar3 mr-1"></i>Posted
                  </span>
                  <span className="font-medium text-slate-700">
                    {new Date(currentJob.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>

              {/* Recruiter Information Card (PRD Required) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  About the Recruiter & Company
                </h3>
                <div className="flex items-center gap-3.5 mb-4">
                  {companyLogo && !logoError ? (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-slate-50 flex-shrink-0"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-navy-900 text-white font-display font-bold text-base flex items-center justify-center flex-shrink-0">
                      {currentJob.recruiter?.name
                        ? currentJob.recruiter.name.charAt(0).toUpperCase()
                        : companyName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-sm font-bold text-slate-900 truncate m-0">
                      {currentJob.recruiter?.name || "Hiring Manager"}
                    </h4>
                    <p className="text-xs text-slate-500 truncate m-0 mt-0.5">
                      {currentJob.recruiter?.companyName || companyName}
                    </p>
                    {currentJob.recruiter?.email && (
                      <p className="text-xs text-slate-500 break-all sm:truncate m-0 mt-0.5">
                        {currentJob.recruiter.email}
                      </p>
                    )}
                  </div>
                </div>

                {currentJob.recruiter?.aboutCompany && (
                  <p className="text-xs text-slate-600 leading-relaxed break-words mb-3">
                    {currentJob.recruiter.aboutCompany}
                  </p>
                )}

                {companyWebsite && (
                  <a
                    href={companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 no-underline">
                    <i className="bi bi-globe2"></i>
                    <span>Visit Company Website</span>
                    <i className="bi bi-box-arrow-up-right text-[10px]"></i>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Jobs Section (PRD Required) */}
        {similarJobs && similarJobs.length > 0 && (
          <section className="mt-10 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-slate-900 m-0">
                Similar Jobs
              </h2>
              <Link
                to="/jobs"
                className="text-xs font-semibold text-brand-700 hover:underline no-underline">
                View all jobs
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default JobDetails;
