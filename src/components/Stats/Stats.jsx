import React from "react";
import { Link } from "react-router-dom";
import "./Stats.css";

const FeatureStats = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
            Built for Candidates & Hiring Managers
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Intelligent Workflows for Every Stage of Hiring
          </h2>
          <p className="text-sm sm:text-base text-slate-600 m-0">
            Purpose-built tools connecting job discovery, interview readiness,
            and data-grounded candidate evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center text-2xl mb-5">
              <i className="bi bi-robot"></i>
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
              AI Interview Prep
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Get tailored interview questions, core topics to revise, and
              actionable preparation tips generated directly from any job's
              required tech stack.
            </p>
            <Link
              to="/jobs"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 no-underline">
              <span>Select a job to practice</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-navy-50 border border-navy-100 text-navy-900 flex items-center justify-center text-2xl mb-5">
              <i className="bi bi-briefcase"></i>
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
              Top Tech Companies
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Filter verified positions by salary tier, experience level,
              employment type, and remote or on-site work mode with persistent
              URL state.
            </p>
            <Link
              to="/jobs"
              className="text-xs font-semibold text-navy-900 hover:text-brand-700 inline-flex items-center gap-1 no-underline">
              <span>Browse open positions</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-2xl mb-5">
              <i className="bi bi-chat-square-text"></i>
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
              AI Hiring Assistant
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Recruiters can query our grounded AI assistant to summarize
              applicant pools, compare candidate skills, and prioritize who to
              interview first.
            </p>
            <Link
              to="/register"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 no-underline">
              <span>Start hiring on TalentHub</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { FeatureStats };
