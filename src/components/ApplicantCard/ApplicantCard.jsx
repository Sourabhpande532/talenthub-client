import React, { useState } from "react";
import "./ApplicantCard.css";

const normalizeExternalUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const ApplicantCard = ({ application, onStatusChange }) => {
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [imgError, setImgError] = useState(false);
  const applicant = application?.applicant || {};

  const resumeUrl = normalizeExternalUrl(
    application?.resume || applicant?.resume,
  );
  const appliedDate = application?.appliedAt || application?.createdAt;
  const jobTitle = application?.job?.title;

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "Withdrawn":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-navy-900 border-slate-200";
    }
  };

  const handleAction = async (nextStatus) => {
    if (!onStatusChange || updatingStatus) return;
    try {
      setUpdatingStatus(nextStatus);
      await onStatusChange(application._id, nextStatus);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const cleanSkills = Array.isArray(applicant?.skills)
    ? applicant.skills
        .flatMap((s) => (typeof s === "string" ? s.split(",") : []))
        .map((s) => s.replace(/,$/, "").trim())
        .filter(Boolean)
    : [];

  return (
    <div className="applicant-card bg-white rounded-xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all p-4 sm:p-5 mb-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Candidate Identity */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 lg:w-4/12">
          {applicant?.photo && !imgError ? (
            <img
              src={applicant.photo}
              alt={applicant?.name || "Candidate"}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-navy-900 text-white font-display font-bold text-lg flex items-center justify-center flex-shrink-0">
              {applicant?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display text-base font-bold text-slate-900 truncate m-0">
                {applicant?.name || "Applicant"}
              </h4>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClasses(
                  application?.status,
                )}`}>
                {application?.status === "Withdrawn"
                  ? "Withdrawn by Candidate"
                  : application?.status === "New"
                    ? "Applied"
                    : application?.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5 mb-0">
              {applicant?.email || "No email provided"}
            </p>
            {jobTitle && (
              <p className="text-xs font-medium text-brand-700 mt-1 mb-0">
                <i className="bi bi-briefcase me-1"></i>
                Applied for: <span className="font-semibold">{jobTitle}</span>
              </p>
            )}
          </div>
        </div>

        {/* Experience, Education & Application Date (PRD Required) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 lg:w-4/12">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <i className="bi bi-briefcase text-slate-400"></i>
              <span className="font-medium text-slate-700">Experience:</span>
              <span>{applicant?.experience || "Fresher / Not specified"}</span>
            </div>
            {applicant?.education && (
              <div className="flex items-center gap-1.5">
                <i className="bi bi-mortarboard text-slate-400"></i>
                <span className="font-medium text-slate-700">Education:</span>
                <span className="truncate max-w-[200px]">
                  {applicant.education}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-500">
              <i className="bi bi-calendar3 text-slate-400"></i>
              <span>
                Applied:{" "}
                {appliedDate
                  ? new Date(appliedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>

        {/* Resume Link & Status Actions */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 lg:w-4/12 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors no-underline">
              <i className="bi bi-file-earmark-text text-brand-600"></i>
              <span>View Resume</span>
              <i className="bi bi-box-arrow-up-right text-[10px] text-slate-400"></i>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 bg-slate-50 border border-slate-100">
              <i className="bi bi-file-earmark-x"></i>
              <span>No Resume</span>
            </span>
          )}

          {application?.status === "Withdrawn" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <i className="bi bi-info-circle"></i>
              <span>Withdrawn by Candidate</span>
            </span>
          ) : (
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAction("Shortlisted")}
                disabled={
                  application?.status === "Shortlisted" ||
                  Boolean(updatingStatus)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  application?.status === "Shortlisted"
                    ? "bg-emerald-600 text-white border-emerald-600 cursor-default"
                    : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                }`}>
                <i className="bi bi-check2-circle mr-1"></i>
                {updatingStatus === "Shortlisted"
                  ? "Saving..."
                  : application?.status === "Shortlisted"
                    ? "Shortlisted"
                    : "Shortlist"}
              </button>
              <button
                type="button"
                onClick={() => handleAction("Rejected")}
                disabled={
                  application?.status === "Rejected" || Boolean(updatingStatus)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  application?.status === "Rejected"
                    ? "bg-red-600 text-white border-red-600 cursor-default"
                    : "bg-white text-red-600 border-red-300 hover:bg-red-50"
                }`}>
                <i className="bi bi-x-circle mr-1"></i>
                {updatingStatus === "Rejected"
                  ? "Saving..."
                  : application?.status === "Rejected"
                    ? "Rejected"
                    : "Reject"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Skills Row */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
          Skills:
        </span>
        {cleanSkills.length > 0 ? (
          cleanSkills.map((skill, index) => (
            <span
              key={index}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400 italic">Not specified</span>
        )}
      </div>
    </div>
  );
};

export default ApplicantCard;
