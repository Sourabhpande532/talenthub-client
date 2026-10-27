import React, { useEffect } from "react";
import { useFilterMechanism } from "../../hooks/useFilterMechanism";
import "./FilterSidebar.css";

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Any Experience" },
  { value: "Fresher", label: "Fresher (0 – 1 yr)" },
  { value: "1-3 Yrs", label: "1 – 3 years" },
  { value: "3-5 Yrs", label: "3 – 5 years" },
  { value: "5+ Yrs", label: "5+ years" },
];

const WORK_MODE_OPTIONS = [
  { value: "", label: "All" },
  { value: "true", label: "Remote" },
  { value: "false", label: "On-site" },
];

export const FilterContent = ({
  isMobile = false,
  filters: propFilters,
  handleFilterChange: propHandleChange,
  handleClearFilters: propHandleClear,
}) => {
  const fallback = useFilterMechanism({ autoFetch: false });
  const filters = propFilters || fallback.filters;
  const handleFilterChange = propHandleChange || fallback.handleFilterChange;
  const handleClearFilters = propHandleClear || fallback.handleClearFilters;

  const activeCount = [
    filters.location,
    filters.remote,
    filters.experience,
    filters.employmentType,
    filters.salary,
  ].filter(Boolean).length;

  return (
    <div className="filter-content-wrapper space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <i className="bi bi-sliders text-brand-600 text-base"></i>
          <h2 className="font-display text-base font-bold text-slate-900 m-0">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-navy-900 text-white">
              {activeCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline bg-transparent border-0 p-0 cursor-pointer">
          Clear all
        </button>
      </div>

      {/* Work Mode: Remote / On-site (PRD Requirement) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Work Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/80">
          {WORK_MODE_OPTIONS.map((mode) => {
            const active = (filters.remote || "") === mode.value;
            return (
              <button
                key={mode.label}
                type="button"
                onClick={() =>
                  handleFilterChange({
                    target: { name: "remote", value: mode.value },
                  })
                }
                className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-all ${
                  active
                    ? "bg-white text-navy-900 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor={isMobile ? "mobile-filter-location" : "filter-location"}
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Location
        </label>
        <select
          id={isMobile ? "mobile-filter-location" : "filter-location"}
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-800 font-medium transition-colors cursor-pointer">
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

      {/* Experience */}
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Experience Level
        </span>
        <div className="space-y-2">
          {EXPERIENCE_OPTIONS.map((exp) => {
            const inputId = `${isMobile ? "mobile-" : ""}exp-${
              exp.value || "all"
            }`;
            const isChecked = filters.experience === exp.value;
            return (
              <label
                key={exp.value || "all"}
                htmlFor={inputId}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                  isChecked
                    ? "bg-brand-50/70 border-brand-300 text-navy-900 font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}>
                <input
                  id={inputId}
                  type="radio"
                  name="experience"
                  value={exp.value}
                  checked={isChecked}
                  onChange={handleFilterChange}
                  className="w-4 h-4 accent-navy-900 cursor-pointer flex-shrink-0"
                />
                <span className="leading-snug">{exp.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Employment Type */}
      <div>
        <label
          htmlFor={isMobile ? "mobile-filter-empType" : "filter-empType"}
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Employment Type
        </label>
        <select
          id={isMobile ? "mobile-filter-empType" : "filter-empType"}
          name="employmentType"
          value={filters.employmentType}
          onChange={handleFilterChange}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-800 font-medium transition-colors cursor-pointer">
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      {/* Salary Range */}
      <div>
        <label
          htmlFor={isMobile ? "mobile-filter-salary" : "filter-salary"}
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Minimum Salary Range
        </label>
        <select
          id={isMobile ? "mobile-filter-salary" : "filter-salary"}
          name="salary"
          value={filters.salary}
          onChange={handleFilterChange}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-800 font-medium transition-colors cursor-pointer">
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

export const FilterSidebar = ({
  filters,
  handleFilterChange,
  handleClearFilters,
  mobileOpen = false,
  onCloseMobile,
}) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && mobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block lg:col-span-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 sticky top-24">
          <FilterContent
            isMobile={false}
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleClearFilters={handleClearFilters}
          />
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filterDrawerTitle">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-over Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2
                id="filterDrawerTitle"
                className="font-display text-base font-bold text-slate-900 flex items-center gap-2 m-0">
                <i className="bi bi-funnel-fill text-brand-600"></i>
                <span>Filter Opportunities</span>
              </h2>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close filters"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 transition-colors">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <FilterContent
                isMobile={true}
                filters={filters}
                handleFilterChange={handleFilterChange}
                handleClearFilters={handleClearFilters}
              />
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (handleClearFilters) handleClearFilters();
                }}
                className="w-1/2 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors">
                Reset
              </button>
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-1/2 py-2.5 rounded-lg bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
