import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addBookmark, removeBookmark } from "../../features/user/userSlice";
import { setUser } from "../../features/auth/authSlice";
import { resolveImageUrl } from "../../utils/urlHelper";
import "./JobCard.css";

const formatExperience = (exp) => {
  if (!exp) return "";
  if (exp.toLowerCase() === "fresher") return "Fresher";
  if (exp.toLowerCase().includes("yr") || exp.toLowerCase().includes("year")) {
    return exp;
  }
  return `${exp} Yrs`;
};

const JobCard = ({ job, isBookmarked, onBookmarkToggle, hideBookmark }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [bookmarking, setBookmarking] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const companyName =
    job?.company ||
    job?.companyName ||
    job?.recruiter?.companyName ||
    "Company";
  const isOwnRecruiterJob =
    user?.role === "Recruiter" &&
    job?.recruiter &&
    (job.recruiter._id === user._id || job.recruiter === user._id);
  const companyLogo = resolveImageUrl(
    job?.recruiter?.companyLogo ||
      (isOwnRecruiterJob ? user?.companyLogo : ""),
  );

  useEffect(() => {
    setLogoError(false);
  }, [companyLogo]);

  const computedBookmarked =
    isBookmarked !== undefined
      ? isBookmarked
      : Boolean(
          user?.bookmarks?.some(
            (b) => (typeof b === "string" ? b : b?._id) === job?._id,
          ),
        );

  const shouldHideBookmark = hideBookmark || user?.role === "Recruiter";

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onBookmarkToggle) {
      onBookmarkToggle(job._id, computedBookmarked);
      return;
    }

    if (!token) {
      toast.error("Please login to bookmark jobs");
      return;
    }
    if (user?.role === "Recruiter" || bookmarking) return;

    try {
      setBookmarking(true);
      if (computedBookmarked) {
        const res = await dispatch(removeBookmark(job._id));
        if (removeBookmark.fulfilled.match(res)) {
          dispatch(setUser(res.payload));
        }
      } else {
        const res = await dispatch(addBookmark(job._id));
        if (addBookmark.fulfilled.match(res)) {
          dispatch(setUser(res.payload));
        }
      }
    } finally {
      setBookmarking(false);
    }
  };

  const cleanSkills = Array.isArray(job?.skills)
    ? job.skills
        .map((s) => (typeof s === "string" ? s.replace(/,$/, "").trim() : ""))
        .filter(Boolean)
    : [];

  const isRemoteRole =
    Boolean(job?.remote) ||
    (job?.location && job.location.toLowerCase().includes("remote"));

  return (
    <article className="job-card group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between h-full p-5">
      <div>
        {/* Card Header: Company Avatar, Title & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-start gap-3.5 min-w-0">
            {companyLogo && !logoError ? (
              <img
                src={companyLogo}
                alt={companyName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-lg object-cover border border-slate-200 flex-shrink-0 bg-slate-50"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-navy-50 border border-navy-100 text-navy-900 font-display font-bold text-lg flex items-center justify-center flex-shrink-0">
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug line-clamp-1 m-0">
                <Link
                  to={`/jobs/${job?._id}`}
                  className="text-inherit no-underline hover:underline">
                  {job?.title}
                </Link>
              </h3>
              <p className="text-sm font-medium text-slate-600 truncate mt-0.5 mb-0">
                {companyName}
              </p>
            </div>
          </div>

          {!shouldHideBookmark && (
            <button
              type="button"
              onClick={handleBookmarkClick}
              disabled={bookmarking}
              aria-label={
                computedBookmarked ? "Remove bookmark" : "Bookmark job"
              }
              title={computedBookmarked ? "Saved in Bookmarks" : "Save Job"}
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors ${
                computedBookmarked
                  ? "bg-brand-50 border-brand-200 text-brand-700"
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}>
              <i
                className={`bi text-base ${
                  computedBookmarked ? "bi-bookmark-fill" : "bi-bookmark"
                }`}></i>
            </button>
          )}
        </div>

        {/* Key Metadata Pills: Salary, Experience, Location, Employment Type */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <i className="bi bi-currency-rupee"></i>
            {job?.salary} LPA
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
            <i className="bi bi-briefcase text-slate-500"></i>
            {formatExperience(job?.experience)}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
            <i className="bi bi-geo-alt text-slate-500"></i>
            {job?.location}
          </span>
          {job?.employmentType && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200/80">
              {job.employmentType}
            </span>
          )}
          {isRemoteRole &&
            job?.location?.toLowerCase() !== "remote" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                Remote Friendly
              </span>
            )}
        </div>

        {/* Skills Preview */}
        {cleanSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {cleanSkills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                {skill}
              </span>
            ))}
            {cleanSkills.length > 4 && (
              <span className="px-1.5 py-0.5 rounded text-[11px] font-medium text-slate-500">
                +{cleanSkills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Posted Date & View Details */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-1">
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <i className="bi bi-clock text-slate-400"></i>
          {job?.createdAt
            ? new Date(job.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Recently posted"}
        </span>
        <Link
          to={`/jobs/${job?._id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-navy-900 hover:bg-brand-600 text-white transition-colors no-underline">
          <span>View Details</span>
          <i className="bi bi-arrow-right text-[11px]"></i>
        </Link>
      </div>
    </article>
  );
};

export default JobCard;
