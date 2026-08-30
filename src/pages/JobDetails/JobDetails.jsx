import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { clearCurrentJob, fetchJobById } from "../../features/jobs/jobSlice";
import {
  addBookmark,
  fetchAppliedJobs,
  removeBookmark,
} from "../../features/user/userSlice";
import {
  clearAIResults,
  generateInterviewPrep,
} from "../../features/ai/aiSlice";
import toast from "react-hot-toast";
import {
  applyToJob,
  withdrawApplication,
} from "../../features/application/applicationSlice";
import JobCard from "../../components/JobCard/JobCard";
import { setUser } from '../../features/auth/authSlice';
import './JobDetails.css';

const formatExperience = (exp) => {
  if (!exp) return "";
  if (exp.toLowerCase() === "fresher") return "Fresher";
  if (exp.toLowerCase().includes("yr") || exp.toLowerCase().includes("year")) {
    return exp;
  }
  return `${exp} Yrs`;
};

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentJob, currentJobStatus, similarJobs } = useSelector(
    (state) => state.jobs,
  );
  const { user, token } = useSelector((state) => state.auth);
  const { appliedJobs } = useSelector((state) => state.user);
  const { status: applyStatus } = useSelector((state) => state.applications);
  const { interviewPrepResult, status: aiStatus } = useSelector(
    (state) => state.ai,
  );

  // Local state to check if the current applicant has applied
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);

  const isBookmarked = user?.bookmarks?.some((b) => b === id || b._id === id);

  useEffect(() => {
    dispatch(fetchJobById(id));
    if (token && user?.role === "Applicant") {
      dispatch(fetchAppliedJobs());
    }
    return () => {
      dispatch(clearCurrentJob());
      dispatch(clearAIResults());
    };
  }, [dispatch, id, token, user?.role]);

  useEffect(() => {
    if (appliedJobs && appliedJobs.length > 0 && id) {
      const matchApp = appliedJobs.find(
        (app) => (app.job?._id || app.job) === id,
      );
      if (matchApp) {
        setHasApplied(true);
        setApplicationId(matchApp._id);
      } else {
        setHasApplied(false);
        setApplicationId(null);
      }
    }
  }, [appliedJobs, id]);

  const handleApply = async () => {
    if (!token) return toast.error("Please login to apply");
    if (user?.role === "Recruiter")
      return toast.error("Recruiters cannot apply for jobs");

    const res = await dispatch(
      applyToJob({ jobId: id, resume: user?.resume || "" }),
    );
    if (applyToJob.fulfilled.match(res)) {
      setHasApplied(true);
      setApplicationId(res.payload?.data?._id);
      dispatch(fetchAppliedJobs());
    }
  };

  const handleWithdraw = async () => {
    if (!applicationId) return toast.error("Application ID not found");
    const res = await dispatch(withdrawApplication(applicationId));
    if (withdrawApplication.fulfilled.match(res)) {
      setHasApplied(false);
      setApplicationId(null);
      dispatch(fetchAppliedJobs());
    }
  };

  const handleBookmarkToggle = async () => {
    if (!token) return toast.error("Please login to bookmark jobs");
    if (user?.role === "Recruiter") return;

    if (isBookmarked) {
      const res = await dispatch(removeBookmark(id));
      if (removeBookmark.fulfilled.match(res)) {
        dispatch(setUser(res.payload)); // Update user in auth slice
      }
    } else {
      const res = await dispatch(addBookmark(id));
      if (addBookmark.fulfilled.match(res)) {
        dispatch(setUser(res.payload)); // Update user in auth slice
      }
    }
  };

  const handleGeneratePrep = () => {
    dispatch(generateInterviewPrep(id));
  };

  if (currentJobStatus === "loading") {
    return (
      <div className='d-flex justify-content-center align-items-center min-vh-100'>
        <div className='spinner-border text-primary' role='status'></div>
      </div>
    );
  }

  if (!currentJob) {
    return <div className='text-center py-5'>Job not found.</div>;
  }

  const companyName =
    currentJob.company ||
    currentJob.companyName ||
    currentJob.recruiter?.companyName ||
    "Company";

  return (
    <div className='job-details-page bg-body-tertiary min-vh-100 py-4'>
      <div className='container'>
        <Link
          to='/jobs'
          className='text-decoration-none text-muted mb-4 d-inline-block fw-medium'>
          <i className='bi bi-arrow-left me-2'></i> Back to jobs
        </Link>

        <div className='row g-4'>
          {/* Main Content */}
          <div className='col-lg-8'>
            <div className='card border-0 shadow-sm rounded-4 mb-4'>
              <div className='card-body p-4 p-md-5'>
                <div className='d-flex gap-4 align-items-center mb-4'>
                  <div className='company-logo bg-light rounded-4 d-flex justify-content-center align-items-center text-primary fw-bold display-6'>
                    {companyName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className='fw-bold mb-1'>{currentJob.title}</h2>
                    <p className='text-muted fs-5 mb-0'>{companyName}</p>
                  </div>
                </div>

                <div className='d-flex flex-wrap gap-3 mb-5'>
                  <span className='badge bg-primary-subtle text-primary border border-primary px-3 py-2 rounded-pill fs-6 fw-normal'>
                    <i className='bi bi-currency-rupee me-1'></i>{" "}
                    {currentJob.salary} LPA
                  </span>
                  <span className='badge bg-secondary-subtle text-secondary border px-3 py-2 rounded-pill fs-6 fw-normal'>
                    <i className='bi bi-briefcase me-1'></i>{" "}
                    {formatExperience(currentJob.experience)}
                  </span>
                  <span className='badge bg-secondary-subtle text-secondary border px-3 py-2 rounded-pill fs-6 fw-normal'>
                    <i className='bi bi-geo-alt me-1'></i> {currentJob.location}
                  </span>
                </div>

                <h4 className='fw-bold mb-3'>Job Description</h4>
                <div className='mb-5 text-muted lh-lg'>
                  <pre
                    style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                    {currentJob.description || "No description provided."}
                  </pre>
                </div>

                <h4 className='fw-bold mb-3'>Skills Required</h4>
                <div className='d-flex flex-wrap gap-2 mb-4'>
                  {currentJob.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className='badge bg-light text-dark border px-3 py-2 fw-medium'>
                      {skill}
                      {idx < currentJob.skills.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Interview Prep Section (Applicant Only) */}
            {user?.role === "Applicant" && (
              <div className='card border-0 shadow-sm rounded-4 border-top border-primary border-4 mt-4 overflow-hidden'>
                <div className='card-header bg-white border-0 pt-4 pb-0 px-4 px-md-5 d-flex justify-content-between align-items-center'>
                  <h5 className='fw-bold mb-0 text-primary'>
                    <i className='bi bi-robot me-2'></i> AI Interview
                    Preparation
                  </h5>
                  <button
                    className='btn btn-outline-primary rounded-pill fw-medium btn-sm px-3'
                    onClick={handleGeneratePrep}
                    disabled={aiStatus === "loading"}>
                    {aiStatus === "loading"
                      ? "Generating..."
                      : "Generate Guide"}
                  </button>
                </div>
                <div className='card-body p-4 p-md-5'>
                  {aiStatus === "idle" && !interviewPrepResult && (
                    <div className='text-center text-muted py-4'>
                      <i className='bi bi-magic fs-1 mb-2 d-block text-primary opacity-50'></i>
                      <p>
                        Generate personalized interview questions and tips based
                        on this job's requirements.
                      </p>
                    </div>
                  )}

                  {aiStatus === "loading" && (
                    <div className='text-center py-5'>
                      <div
                        className='spinner-border text-primary'
                        role='status'></div>
                      <p className='mt-3 text-muted fw-medium'>
                        Analyzing job and generating preparation guide...
                      </p>
                    </div>
                  )}

                  {aiStatus === "succeeded" && interviewPrepResult && (
                    <div className='ai-response p-4 bg-body-tertiary rounded-4 border'>
                      <pre
                        className='mb-0'
                        style={{
                          fontFamily: "inherit",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}>
                        {interviewPrepResult}
                      </pre>
                    </div>
                  )}

                  {aiStatus === "failed" && (
                    <div className='alert alert-danger mb-0 rounded-4'>
                      <i className='bi bi-exclamation-triangle-fill me-2'></i>{" "}
                      Failed to generate AI preparation. Please try again.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='col-lg-4'>
            <div className='position-sticky' style={{ top: "100px" }}>
              {/* Apply Card */}
              <div className='card border-0 shadow-sm rounded-4 mb-4'>
                <div className='card-body p-4 text-center'>
                  <h5 className='fw-bold mb-1'>Interested in this job?</h5>
                  <p className='text-muted small mb-4'>
                    Apply now to be considered
                  </p>

                  {user?.role === "Applicant" ? (
                    <>
                      {hasApplied ? (
                        <button
                          className='btn btn-outline-danger w-100 rounded-pill fw-bold py-3 mb-3'
                          onClick={handleWithdraw}
                          disabled={applyStatus === "loading"}>
                          {applyStatus === "loading"
                            ? "Processing..."
                            : "Withdraw Application"}
                        </button>
                      ) : (
                        <button
                          className='btn btn-primary w-100 rounded-pill fw-bold py-3 mb-3'
                          onClick={handleApply}
                          disabled={applyStatus === "loading"}>
                          {applyStatus === "loading"
                            ? "Applying..."
                            : "Apply Now"}
                        </button>
                      )}
                      <button
                        className={`btn w-100 rounded-pill fw-bold py-3 mb-3 ${isBookmarked ? "btn-outline-primary" : "btn-light"}`}
                        onClick={handleBookmarkToggle}>
                        <i
                          className={`bi ${isBookmarked ? "bi-bookmark-fill" : "bi-bookmark"} me-2`}></i>
                        {isBookmarked ? "Bookmarked" : "Save Job"}
                      </button>
                    </>
                  ) : user?.role === "Recruiter" ? (
                    <div className='alert alert-secondary mb-0 rounded-3 small'>
                      Recruiters cannot apply to jobs.
                    </div>
                  ) : (
                    <Link
                      to='/login'
                      className='btn btn-primary w-100 rounded-pill fw-bold py-3 mb-3'>
                      Login to Apply
                    </Link>
                  )}

                  <div className='d-flex justify-content-center gap-2 mt-3'>
                    <span className='badge bg-light text-muted border px-3 py-2 fw-normal rounded-pill'>
                      <i className='bi bi-calendar me-1'></i> Posted{" "}
                      {new Date(currentJob.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recruiter Details Card */}
              <div className='card border-0 shadow-sm rounded-4'>
                <div className='card-body p-4'>
                  <h6 className='fw-bold mb-4'>About the Recruiter</h6>
                  <div className='d-flex align-items-center gap-3 mb-3'>
                    <div
                      className='avatar-circle bg-primary text-white fs-5'
                      style={{ width: "48px", height: "48px" }}>
                      {currentJob.recruiter?.name
                        ? currentJob.recruiter.name.charAt(0).toUpperCase()
                        : "R"}
                    </div>
                    <div>
                      <h6 className='mb-0 fw-bold'>
                        {currentJob.recruiter?.name || "Hiring Manager"}
                      </h6>
                      <small className='text-muted'>
                        {currentJob.recruiter?.email}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Jobs Section */}
        {similarJobs && similarJobs.length > 0 && (
          <div className='mt-5 pt-4 border-top'>
            <h4 className='fw-bold mb-4'>Similar Jobs</h4>
            <div className='row g-4'>
              {similarJobs.map((job) => (
                <div key={job._id} className='col-md-6 col-lg-4'>
                  <JobCard job={job} hideBookmark={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
