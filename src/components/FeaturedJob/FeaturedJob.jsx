import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchJobs } from "../../features/jobs/jobSlice";
import JobCard from "../JobCard/JobCard";
import "./FeaturedJob.css";

const HIRING_COMPANIES = [
  { name: "Google", domain: "Cloud & Core Platforms" },
  { name: "Microsoft", domain: "Azure & Enterprise" },
  { name: "Amazon", domain: "Distributed Systems" },
  { name: "GitHub", domain: "Developer Tooling" },
  { name: "Stripe", domain: "Fintech Infrastructure" },
  { name: "Atlassian", domain: "Collaboration Suite" },
  { name: "Flipkart", domain: "Commerce Engineering" },
  { name: "Razorpay", domain: "Payments & Banking" },
  { name: "Swiggy", domain: "Consumer Logistics" },
  { name: "Zomato", domain: "High-Scale Dispatch" },
  { name: "Adobe", domain: "Creative Cloud" },
  { name: "Sarvam AI", domain: "Generative AI" },
  { name: "Infosys", domain: "Digital Services" },
  { name: "Accenture", domain: "Cloud Transformation" },
];

const FeaturedJob = () => {
  const { jobsList, status } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const { featuredJobs, recentJobs } = useMemo(() => {
    if (!Array.isArray(jobsList) || jobsList.length === 0) {
      return { featuredJobs: [], recentJobs: [] };
    }

    // Featured jobs: highest impact / senior & diverse tech stack roles
    const bySalaryDesc = [...jobsList].sort(
      (a, b) => (Number(b.salary) || 0) - (Number(a.salary) || 0),
    );
    const featured = bySalaryDesc.slice(0, 6);
    const featuredIds = new Set(featured.map((j) => j._id));

    // Recently posted jobs: sorted by createdAt descending, preferring items not already in featured
    const byDateDesc = [...jobsList].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
    const nonOverlappingRecent = byDateDesc.filter(
      (j) => !featuredIds.has(j._id),
    );
    const recent =
      nonOverlappingRecent.length >= 6
        ? nonOverlappingRecent.slice(0, 6)
        : byDateDesc.slice(0, 6);

    return { featuredJobs: featured, recentJobs: recent };
  }, [jobsList]);

  return (
    <div className="featured-jobs-section">
      {/* Hiring Companies Showcase */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
                Hiring Teams on TalentHub
              </p>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 m-0">
                Explore Open Roles by Engineering Organization
              </h2>
            </div>
            <Link
              to="/jobs"
              className="text-sm font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 no-underline">
              <span>Browse directory</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {HIRING_COMPANIES.map((company) => (
              <Link
                key={company.name}
                to={`/jobs?search=${encodeURIComponent(company.name)}`}
                className="group p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-2.5 no-underline">
                <div className="w-8 h-8 rounded-lg bg-navy-900 text-white font-display font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-brand-600 transition-colors">
                  {company.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-navy-900 truncate m-0">
                    {company.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate m-0">
                    {company.domain}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-14 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-600 mb-1.5">
                Spotlight Roles
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 m-0">
                Featured Jobs
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1 mb-0">
                High-impact engineering, product, and design roles from top
                employers
              </p>
            </div>
            <Link
              to="/jobs?sort=salary-desc"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold shadow-sm transition-all no-underline self-start sm:self-auto">
              <span>View All Jobs</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {status === "loading" && (!jobsList || jobsList.length === 0) ? (
            <div className="py-16 text-center">
              <div
                className="w-10 h-10 border-4 border-slate-200 border-t-navy-900 rounded-full animate-spin mx-auto"
                role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mt-3">
                Loading featured opportunities...
              </p>
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
              <i className="bi bi-inbox text-3xl block mb-2 text-slate-400"></i>
              <p className="m-0 font-medium">No featured jobs found at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recently Posted Jobs Section (PRD Landing Requirement) */}
      <section className="py-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-600 mb-1.5">
                Fresh Additions
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 m-0">
                Recently Posted Jobs
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1 mb-0">
                Discover the newest openings added to TalentHub across remote
                and on-site hubs
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold shadow-sm transition-all no-underline self-start sm:self-auto">
              <span>Explore All {jobsList?.length || ""} Roles</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {status === "loading" && (!jobsList || jobsList.length === 0) ? (
            <div className="py-12 text-center">
              <div
                className="w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mx-auto"
                role="status"></div>
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentJobs.map((job) => (
                <JobCard key={`recent-${job._id}`} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-10 text-center text-slate-500">
              <p className="m-0 font-medium">No recent jobs available right now.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export { FeaturedJob };
