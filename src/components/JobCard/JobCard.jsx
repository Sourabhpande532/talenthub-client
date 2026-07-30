import React from "react";
import { Link } from "react-router-dom";
import "./JobCard.css";

const JobCard = ({ job, isBookmarked, onBookmarkToggle, hideBookmark }) => {
  return (
    <div className="card job-card shadow-sm border-0 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex gap-3">
            <div className="company-logo-placeholder bg-light rounded-3 d-flex align-items-center justify-content-center text-primary fw-bold fs-4">
              {job?.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <h5 className="card-title fw-bold mb-1">{job?.title}</h5>
              <p className="card-text text-muted mb-0">{job?.companyName || "Acme Inc."}</p>
            </div>
          </div>
          {!hideBookmark && (
            <button 
              className={`btn btn-link p-0 bookmark-btn ${isBookmarked ? 'text-primary' : 'text-muted'}`}
              onClick={(e) => {
                e.preventDefault();
                if(onBookmarkToggle) onBookmarkToggle(job._id, isBookmarked);
              }}
            >
              <i className={`bi fs-5 ${isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
            </button>
          )}
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="badge bg-light text-dark border fw-normal px-2 py-1">
            <i className="bi bi-currency-rupee me-1"></i>{job?.salary} LPA
          </span>
          <span className="badge bg-light text-dark border fw-normal px-2 py-1">
            <i className="bi bi-briefcase me-1"></i>{job?.experience} Yrs
          </span>
          <span className="badge bg-light text-dark border fw-normal px-2 py-1">
            <i className="bi bi-geo-alt me-1"></i>{job?.location}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <small className="text-muted">
            {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
          </small>
          <Link to={`/jobs/${job?._id}`} className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-medium">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
