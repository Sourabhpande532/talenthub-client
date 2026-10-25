import React from 'react';
import { useFilterMechanism } from '../../hooks/useFilterMechanism';
import './FilterSidebar.css';

export const FilterContent = ({ isMobile = false }) => {
  const { handleClearFilters, filters, handleFilterChange } = useFilterMechanism();

  const activeCount = [
    filters.location,
    filters.experience,
    filters.employmentType,
    filters.salary,
  ].filter(Boolean).length;

  return (
    <div className="filter-content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0 text-body d-flex align-items-center gap-2">
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="badge bg-primary rounded-pill small fw-normal">
              {activeCount} active
            </span>
          )}
        </h5>
        <button
          onClick={handleClearFilters}
          className="btn btn-link text-decoration-none p-0 small fw-semibold text-primary">
          Clear all
        </button>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wider">
          Location
        </h6>
        <select
          name="location"
          className="form-select bg-body-tertiary text-body border-secondary border-opacity-25 py-2 rounded-3"
          value={filters.location}
          onChange={handleFilterChange}>
          <option value="">Any Location</option>
          <option value="Remote">Remote Only</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Chennai">Chennai</option>
          <option value="Delhi NCR">Delhi NCR</option>
        </select>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wider">
          Experience
        </h6>
        <div className="d-flex flex-column gap-2">
          {["", "Fresher", "1-3 Yrs", "3-5 Yrs", "5+ Yrs"].map((exp) => (
            <div className="form-check custom-radio" key={exp || "all"}>
              <input
                className="form-check-input"
                type="radio"
                name="experience"
                id={isMobile ? `mobile-${exp || "all-exp"}` : exp || "all-exp"}
                value={exp}
                checked={filters.experience === exp}
                onChange={handleFilterChange}
              />
              <label
                className="form-check-label text-secondary fw-medium cursor-pointer"
                htmlFor={isMobile ? `mobile-${exp || "all-exp"}` : exp || "all-exp"}>
                {exp === ""
                  ? "Any Experience"
                  : exp === "Fresher"
                  ? "Fresher (0 - 1 years)"
                  : exp.replace("Yrs", "years")}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wider">
          Employment Type
        </h6>
        <select
          name="employmentType"
          className="form-select bg-body-tertiary text-body border-secondary border-opacity-25 py-2 rounded-3"
          value={filters.employmentType}
          onChange={handleFilterChange}>
          <option value="">All Job Types</option>
          <option value="Full-time">Full Time</option>
          <option value="Part-time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wider">
          Minimum Salary Range
        </h6>
        <select
          name="salary"
          className="form-select bg-body-tertiary text-body border-secondary border-opacity-25 py-2 rounded-3"
          value={filters.salary}
          onChange={handleFilterChange}>
          <option value="">Any Salary</option>
          <option value="5">5+ LPA</option>
          <option value="10">10+ LPA</option>
          <option value="15">15+ LPA</option>
          <option value="20">20+ LPA</option>
          <option value="25">25+ LPA</option>
        </select>
      </div>
    </div>
  );
};

export const FilterSidebar = () => {
  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="col-lg-3 d-none d-lg-block">
        <div
          className="card border-0 shadow-sm rounded-4 position-sticky filter-sidebar-card mb-4"
          style={{ top: "100px", minHeight: "75vh" }}>
          <div className="card-body p-4">
            <FilterContent isMobile={false} />
          </div>
        </div>
      </div>

      {/* Mobile Bootstrap Offcanvas Drawer */}
      <div
        className="offcanvas offcanvas-start d-lg-none rounded-end-4 shadow"
        tabIndex="-1"
        id="filterOffcanvas"
        aria-labelledby="filterOffcanvasLabel">
        <div className="offcanvas-header border-bottom px-4 py-3">
          <h5 className="offcanvas-title fw-bold text-body d-flex align-items-center gap-2" id="filterOffcanvasLabel">
            <i className="bi bi-funnel-fill text-primary"></i> Filter Opportunities
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-4">
          <FilterContent isMobile={true} />
        </div>
      </div>
    </>
  );
};
