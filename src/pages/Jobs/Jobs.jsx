import React from "react";
import { FilterSidebar } from "../../components/FilterSidebar/FilterSidebar";
import JobCard from "../../components/JobCard/JobCard";
import { useFilterMechanism } from "../../hooks/useFilterMechanism";
import "./Jobs.css";

const Jobs = () => {
  const { filters, handleFilterChange, handleClearFilters, jobsList, status } =
    useFilterMechanism();

  const activeFilterCount = [
    filters.location,
    filters.experience,
    filters.employmentType,
    filters.salary,
  ].filter(Boolean).length;

  return (
    <div className="jobs-page bg-body-tertiary min-vh-100 py-4">
      <div className="container">
        {/* Main Search Bar & Mobile Toolbar */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-2 p-md-3 d-flex flex-wrap gap-2 align-items-center">
            {/* Search Input */}
            <div className="flex-grow-1 position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="text"
                name="search"
                className="form-control border-0 bg-body-tertiary rounded-pill ps-5 py-2 text-body"
                placeholder="Search jobs, skills, or companies..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            {/* Mobile Filter Button (visible on screens < 992px) */}
            <button
              className="btn btn-outline-primary d-lg-none d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-medium shadow-sm"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#filterOffcanvas"
              aria-controls="filterOffcanvas">
              <i className="bi bi-funnel-fill"></i>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="badge bg-primary text-white rounded-pill px-2 py-1 small">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Select */}
            <div className="d-flex align-items-center gap-2 px-3 border-start">
              <span className="text-muted small fw-medium text-nowrap d-none d-sm-inline">
                Sort by:
              </span>
              <select
                name="sort"
                className="form-select border-0 shadow-none fw-medium text-primary bg-transparent py-2"
                value={filters.sort}
                onChange={handleFilterChange}>
                <option value="latest">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-desc">Highest Salary</option>
                <option value="salary-asc">Lowest Salary</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Filters Sidebar (Desktop sticky & Mobile Offcanvas) */}
          <FilterSidebar />

          {/* Job Listings Column */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0 text-body">Explore Opportunities</h4>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-medium fs-6">
                {jobsList?.length || 0} jobs found
              </span>
            </div>

            {status === "loading" ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted fw-medium">Searching for available opportunities...</p>
              </div>
            ) : jobsList && jobsList.length > 0 ? (
              <div className="row g-4">
                {jobsList.map((job) => (
                  <div key={job._id} className="col-md-6">
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 text-center py-5">
                <div className="card-body py-5">
                  <i className="bi bi-search fs-1 text-muted mb-3 d-block opacity-50"></i>
                  <h5 className="fw-bold">No jobs found matching your criteria</h5>
                  <p className="text-muted max-w-md mx-auto">
                    Try adjusting your search terms, location, or experience filters to find matching roles.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="btn btn-outline-primary mt-2 rounded-pill fw-medium px-4">
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
