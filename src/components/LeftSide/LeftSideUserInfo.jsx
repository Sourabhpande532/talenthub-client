import React from "react";
import { Link } from "react-router-dom";
import "./LeftSideUserInfo.css";

export const LeftSideUserInfo = ({ role, setRole }) => {
  return (
    <div className="hidden lg:flex lg:col-span-5 bg-navy-900 text-white p-8 xl:p-10 flex-col justify-between relative overflow-hidden">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-300 text-xs font-semibold mb-6">
          <i className="bi bi-briefcase-fill text-brand-400"></i>
          <span>TalentHub Onboarding</span>
        </div>

        <h1 className="font-display text-2xl xl:text-3xl font-bold text-white mb-3">
          Create your account
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed mb-8">
          Join TalentHub to discover verified tech opportunities, prepare with
          AI interview guides, or hire top engineering talent.
        </p>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            I want to register as
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setRole("Applicant")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                role === "Applicant"
                  ? "bg-white text-navy-900 border-white shadow-md"
                  : "bg-navy-800/60 text-white border-navy-700 hover:border-slate-500"
              }`}>
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    role === "Applicant"
                      ? "bg-brand-50 text-brand-700"
                      : "bg-navy-700 text-slate-200"
                  }`}>
                  <i className="bi bi-person-workspace"></i>
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold m-0">
                    Applicant
                  </h2>
                  <p
                    className={`text-xs m-0 mt-0.5 ${
                      role === "Applicant" ? "text-slate-600" : "text-slate-300"
                    }`}>
                    Find jobs, apply, and prepare with AI
                  </p>
                </div>
              </div>
              <i
                className={`bi text-lg ${
                  role === "Applicant"
                    ? "bi-check-circle-fill text-brand-600"
                    : "bi-circle text-slate-400"
                }`}></i>
            </button>

            <button
              type="button"
              onClick={() => setRole("Recruiter")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                role === "Recruiter"
                  ? "bg-white text-navy-900 border-white shadow-md"
                  : "bg-navy-800/60 text-white border-navy-700 hover:border-slate-500"
              }`}>
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    role === "Recruiter"
                      ? "bg-brand-50 text-brand-700"
                      : "bg-navy-700 text-slate-200"
                  }`}>
                  <i className="bi bi-building"></i>
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold m-0">
                    Recruiter
                  </h2>
                  <p
                    className={`text-xs m-0 mt-0.5 ${
                      role === "Recruiter" ? "text-slate-600" : "text-slate-300"
                    }`}>
                    Post jobs, manage & evaluate talent
                  </p>
                </div>
              </div>
              <i
                className={`bi text-lg ${
                  role === "Recruiter"
                    ? "bi-check-circle-fill text-brand-600"
                    : "bi-circle text-slate-400"
                }`}></i>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-navy-800">
        <p className="text-sm text-slate-300 m-0">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-300 hover:text-white font-semibold underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
