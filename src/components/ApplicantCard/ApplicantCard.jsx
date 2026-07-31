import React from "react";
import "./ApplicantCard.css";

const ApplicantCard = ({ application, onStatusChange }) => {
  const applicant = application.applicant;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Shortlisted": return "bg-success-subtle text-success border-success";
      case "Rejected": return "bg-danger-subtle text-danger border-danger";
      default: return "bg-primary-subtle text-primary border-primary";
    }
  };

  return (
    <div className="card applicant-card shadow-sm border-0 mb-3">
      <div className="card-body p-4">
        <div className="row align-items-center">
          
          {/* Profile Info */}
          <div className="col-md-4 d-flex align-items-center gap-3 mb-3 mb-md-0">
            <div className="applicant-avatar bg-light text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center">
              {applicant?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 className="mb-1 fw-bold">{applicant?.name}</h5>
              <p className="text-muted mb-0 small">{applicant?.email}</p>
            </div>
          </div>

          {/* Details */}
          <div className="col-md-3 mb-3 mb-md-0">
            <div className="d-flex flex-column gap-1">
              <span className="small text-muted"><i className="bi bi-briefcase me-1"></i> {applicant?.experience || "N/A"}</span>
              <span className="small text-muted"><i className="bi bi-book me-1"></i> {applicant?.education || "N/A"}</span>
            </div>
          </div>

          {/* Resume & Status */}
          <div className="col-md-2 mb-3 mb-md-0">
            <div className="d-flex flex-column gap-2 align-items-start">
              {application.resume ? (
                <a href={application.resume} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary rounded-pill">
                  <i className="bi bi-file-earmark-pdf me-1"></i> Resume
                </a>
              ) : (
                <span className="text-muted small">No Resume</span>
              )}
              <span className={`badge border px-2 py-1 rounded-pill ${getStatusBadgeClass(application.status)}`}>
                {application.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="col-md-3 text-md-end">
            <div className="btn-group">
              <button 
                className="btn btn-outline-success btn-sm fw-medium"
                onClick={() => onStatusChange(application._id, "Shortlisted")}
                disabled={application.status === "Shortlisted"}
              >
                Shortlist
              </button>
              <button 
                className="btn btn-outline-danger btn-sm fw-medium"
                onClick={() => onStatusChange(application._id, "Rejected")}
                disabled={application.status === "Rejected"}
              >
                Reject
              </button>
            </div>
          </div>

        </div>

        {/* Skills Tags */}
        {applicant?.skills && applicant.skills.length > 0 && (
          <div className="mt-3 pt-3 border-top d-flex flex-wrap gap-2">
            {applicant.skills.map((skill, index) => (
              <span key={index} className="badge bg-light text-secondary border fw-normal">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantCard;
