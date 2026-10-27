import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Hero.css";

const POPULAR_SEARCHES = [
  { label: "React", to: "/jobs?search=React" },
  { label: "Node.js", to: "/jobs?search=Node.js" },
  { label: "Python", to: "/jobs?search=Python" },
  { label: "Remote", to: "/jobs?location=Remote" },
  { label: "Bangalore", to: "/jobs?location=Bangalore" },
  { label: "Full Stack", to: "/jobs?search=Full+Stack" },
];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <section className="relative bg-navy-900 text-white border-b border-navy-800 overflow-hidden">
      {/* Subtle architectural grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800 border border-navy-700 text-brand-300 text-xs font-semibold tracking-wide mb-6">
            <i className="bi bi-stars text-brand-400"></i>
            <span>AI-Powered Technical Hiring & Interview Readiness</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-white tracking-tight leading-[1.15] mb-5">
            Find Tech Roles That{" "}
            <span className="text-brand-400">Fit Your Craft</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
            Explore curated engineering, product, and design positions. Generate
            tailored AI interview preparation guides and apply directly to top
            hiring teams.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="hero-search-form max-w-2xl mx-auto bg-white p-2 rounded-xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center flex-1 min-w-0 px-2.5 sm:pl-3.5 sm:pr-1">
              <i className="bi bi-search text-slate-400 text-base flex-shrink-0 mr-2.5"></i>
              <input
                type="text"
                aria-label="Search jobs, skills, or companies"
                className="w-full py-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent border-0 focus:outline-none"
                placeholder="Search by role, skill (React, Python), or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm sm:text-base transition-colors flex-shrink-0 shadow-sm">
              Search Jobs
            </button>
          </form>

          {/* Quick Popular Search Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Popular:</span>
            {POPULAR_SEARCHES.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="px-2.5 py-1 rounded-md bg-navy-800/90 hover:bg-navy-700 text-slate-200 border border-navy-700 transition-colors no-underline">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Core Value Highlights */}
          <div className="mt-10 pt-8 border-t border-navy-800/80 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <i className="bi bi-check-circle-fill text-brand-400"></i>
              <span>Find verified opportunities</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="bi bi-check-circle-fill text-brand-400"></i>
              <span>Explore leading tech companies</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="bi bi-check-circle-fill text-brand-400"></i>
              <span>Prepare with job-grounded AI</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
