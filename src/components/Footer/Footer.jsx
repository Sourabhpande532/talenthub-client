import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-white no-underline mb-4">
              <span className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-sm">
                <i className="bi bi-briefcase-fill text-base"></i>
              </span>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Talent<span className="text-brand-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-5">
              AI-powered technical recruitment platform connecting verified
              engineering, product, and design talent with high-growth hiring
              teams.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-800 text-slate-300 border border-navy-700">
                <i className="bi bi-shield-check text-brand-400"></i> Verified
                Listings
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-800 text-slate-300 border border-navy-700">
                <i className="bi bi-stars text-brand-400"></i> Grounded AI Prep
              </span>
            </div>
          </div>

          {/* Candidates Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              For Candidates
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0 text-sm">
              <li>
                <Link
                  to="/jobs"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Explore All Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs?remote=true"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Remote Engineering Roles
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs?employmentType=Full-time"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Full-Time Positions
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs?employmentType=Internship"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Internships & Early Career
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Hiring Hubs Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Hiring Locations
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0 text-sm">
              <li>
                <Link
                  to="/jobs?location=Bangalore"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Jobs in Bangalore
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs?location=Hyderabad"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Jobs in Hyderabad
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs?location=Pune"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Jobs in Pune
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs?location=Mumbai"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Jobs in Mumbai
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs?location=Delhi+NCR"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Jobs in Delhi NCR
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiters Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              For Recruiters
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0 text-sm">
              <li>
                <Link
                  to="/create-job"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Recruiter Console
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Create Employer Account
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-slate-400 hover:text-white transition-colors no-underline">
                  Company Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="m-0">
            &copy; {new Date().getFullYear()} TalentHub Hiring Platform. All
            rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/jobs"
              className="text-slate-400 hover:text-white no-underline">
              Browse Jobs
            </Link>
            <Link
              to="/login"
              className="text-slate-400 hover:text-white no-underline">
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-slate-400 hover:text-white no-underline">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
