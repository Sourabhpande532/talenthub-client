import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  applyToJob,
  withdrawApplication,
} from "../../features/application/applicationSlice";
import { addBookmark, removeBookmark } from "../../features/user/userSlice";
import { setUser } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";

export const JobDetailsSidePanel = ({ id }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { currentJob } = useSelector((state) => state.jobs);
  const { status: applyStatus } = useSelector((state) => state.applications);
  const dispatch = useDispatch();
  // Local state to check if the current applicant has applied
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const isBookmarked = user?.bookmarks?.some((b) => b === id || b._id === id);

  useEffect(() => {}, [currentJob, user]);

  const handleApply = async () => {
    if (!token) return toast.error("Please login to apply");
    if (user?.role === "Recruiter")
      return toast.error("Recruiters cannot apply for jobs");

    const res = await dispatch(
      applyToJob({ jobId: id, resume: user?.resume || "" }),
    );
    if (applyToJob.fulfilled.match(res)) {
      setHasApplied(true);
      // In a real scenario, res.payload should return the application ID to allow withdrawal
      setApplicationId(res.payload?.data?._id);
    }
  };

  const handleWithdraw = async () => {
    if (!applicationId) return toast.error("Application ID not found");
    const res = await dispatch(withdrawApplication(applicationId));
    if (withdrawApplication.fulfilled.match(res)) {
      setHasApplied(false);
      setApplicationId(null);
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

  return (
    <div className='col-lg-4'>
      {/* Apply Card */}
      <div
        className='card border-0 shadow-sm rounded-4 mb-4 position-sticky'
        style={{ top: "100px" }}>
        <div className='card-body p-4 text-center'>
          <h5 className='fw-bold mb-1'>Interested in this job?</h5>
          <p className='text-muted small mb-4'>Apply now to be considered</p>

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
                  {applyStatus === "loading" ? "Applying..." : "Apply Now"}
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
              {new Date(currentJob?.createdAt).toLocaleDateString()}
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
              {currentJob?.recruiter?.name
                ? currentJob.recruiter.name.charAt(0).toUpperCase()
                : "R"}
            </div>
            <div>
              <h6 className='mb-0 fw-bold'>
                {currentJob?.recruiter?.name || "Hiring Manager"}
              </h6>
              <small className='text-muted'>
                {currentJob?.recruiter?.email}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
