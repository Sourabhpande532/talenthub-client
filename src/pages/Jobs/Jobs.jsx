import React, { useState } from "react";
import { FilterSidebar } from "../../components/FilterSidebar/FilterSidebar";
import JobCard from "../../components/JobCard/JobCard";
import { useFilterMechanism } from "../../hooks/useFilterMechanism";
import "./Jobs.css";

const Jobs = () => {
  const { filters, handleFilterChange, handleClearFilters, jobsList, status } =
    useFilterMechanism({ autoFetch: true });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFilterCount = [
    filters.location,
    filters.remote,
    filters.experience,
    filters.employmentType,
    filters.salary,
  ].filter(Boolean).length;

  const removeSingleFilter = (key) => {
    handleFilterChange({ target: { name: key, value: "" } });
  };

  return (
    <main className="jobs-page bg-slate-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Search & Sort Control Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-3 sm:p-4 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                name="search"
                aria-label="Search jobs, skills, or companies"
                className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all"
                placeholder="Search by job title, skill (React, Python, AWS), or company..."
                value={filters.search}
                onChange={handleFilterChange}
              />
              {filters.search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => removeSingleFilter("search")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center">
                  <i className="bi bi-x text-base"></i>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              {/* Mobile Filter Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold shadow-sm transition-colors">
                <i className="bi bi-funnel-fill text-brand-600"></i>
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-navy-900 text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Select */}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
                <label
                  htmlFor="jobs-sort-select"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap hidden sm:inline">
                  Sort by:
                </label>
                <select
                  id="jobs-sort-select"
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:border-slate-300 focus:bg-white focus:border-brand-600 focus:outline-none text-sm font-semibold text-navy-900 cursor-pointer">
                  <option value="latest">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="salary-desc">Highest Salary</option>
                  <option value="salary-asc">Lowest Salary</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {(activeFilterCount > 0 || filters.search) && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500 mr-1">
                Active filters:
              </span>
              {filters.search && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  <span>Search: "{filters.search}"</span>
                  <button
                    type="button"
                    onClick={() => removeSingleFilter("search")}
                    aria-label="Remove search filter"
                    className="hover:text-red-600">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200">
                  <span>Location: {filters.location}</span>
                  <button
                    type="button"
                    onClick={() => removeSingleFilter("location")}
                    aria-label="Remove location filter"
                    className="hover:text-red-600">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.remote && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200">
                  <span>
                    Mode: {filters.remote === "true" ? "Remote" : "On-site"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSingleFilter("remote")}
                    aria-label="Remove work mode filter"
                    className="hover:text-red-600">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.experience && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200">
                  <span>Exp: {filters.experience}</span>
                  <button
                    type="button"
                    onClick={() => removeSingleFilter("experience")}
                    aria-label="Remove experience filter"
                    className="hover:text-red-600">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.employmentType && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200">
                  <span>Type: {filters.employmentType}</span>
                  <button
                    type="button"
                    onClick={() => removeSingleFilter("employmentType")}
                    aria-label="Remove employment type filter"
                    className="hover:text-red-600">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.salary && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200">
                  <span>Min Salary: {filters.salary}+ LPA</span>
                  <button
                    type="button"
                    onClick={() => removeSingleFilter("salary")}
                    aria-label="Remove salary filter"
                    className="hover:text-red-600">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-red-600 hover:underline ml-auto">
                Reset all
              </button>
            </div>
          )}
        </div>

        {/* Main Grid: Sidebar + Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <FilterSidebar
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleClearFilters={handleClearFilters}
            mobileOpen={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          <section className="lg:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 m-0">
                  Explore Opportunities
                </h1>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-sm">
                {jobsList?.length || 0}{" "}
                {jobsList?.length === 1 ? "job" : "jobs"} found
              </span>
            </div>

            {status === "loading" ? (
              <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-card">
                <div
                  className="w-10 h-10 border-4 border-slate-200 border-t-navy-900 rounded-full animate-spin mx-auto"
                  role="status"></div>
                <p className="mt-4 text-sm font-medium text-slate-600 mb-0">
                  Searching for available opportunities...
                </p>
              </div>
            ) : jobsList && jobsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {jobsList.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-card">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="bi bi-search"></i>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-1.5">
                  No jobs found matching your criteria
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mb-5">
                  Try adjusting your search keywords, location, work mode, or
                  experience filters to see more open positions.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold transition-colors">
                  Clear All Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Jobs;
