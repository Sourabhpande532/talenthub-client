import { useDispatch, useSelector } from "react-redux";
import { clearAIResults, generateInterviewPrep } from "../../features/ai/aiSlice";
import { useEffect } from "react";
import { clearCurrentJob, fetchJobById } from "../../features/jobs/jobSlice";

export const JobDetailsPrepPanel = ({ id }) => {
  const dispatch = useDispatch();
  const { currentJob, currentJobStatus } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const { interviewPrepResult, status: aiStatus } = useSelector(
    (state) => state.ai,
  );
  const handleGeneratePrep = () => {
    dispatch(generateInterviewPrep(id));
  };
  useEffect(() => {
    dispatch(fetchJobById(id));
    return () => {
      dispatch(clearCurrentJob());
      dispatch(clearAIResults());
    };
  }, [dispatch, id]);

  useEffect(() => {}, [currentJob, user]);

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
  return (
    <div className='col-lg-8'>
      <div className='card border-0 shadow-sm rounded-4 mb-4'>
        <div className='card-body p-4 p-md-5'>
          <div className='d-flex gap-4 align-items-center mb-4'>
            <div className='company-logo bg-light rounded-4 d-flex justify-content-center align-items-center text-primary fw-bold display-6'>
              {currentJob.companyName
                ? currentJob.companyName.charAt(0).toUpperCase()
                : "C"}
            </div>
            <div>
              <h2 className='fw-bold mb-1'>{currentJob.title}</h2>
              <p className='text-muted fs-5 mb-0'>
                {currentJob.companyName || "Acme Inc."}
              </p>
            </div>
          </div>

          <div className='d-flex flex-wrap gap-3 mb-5'>
            <span className='badge bg-primary-subtle text-primary border border-primary px-3 py-2 rounded-pill fs-6 fw-normal'>
              <i className='bi bi-currency-rupee me-1'></i> {currentJob.salary}{" "}
              LPA
            </span>
            <span className='badge bg-secondary-subtle text-secondary border px-3 py-2 rounded-pill fs-6 fw-normal'>
              <i className='bi bi-briefcase me-1'></i> {currentJob.experience}{" "}
              Yrs
            </span>
            <span className='badge bg-secondary-subtle text-secondary border px-3 py-2 rounded-pill fs-6 fw-normal'>
              <i className='bi bi-geo-alt me-1'></i> {currentJob.location}
            </span>
          </div>

          <h4 className='fw-bold mb-3'>Job Description</h4>
          <div className='mb-5 text-muted lh-lg'>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
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
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Interview Prep Section (Applicant Only) */}
      {user?.role !== "Recruiter" && (
        <div className='card border-0 shadow-sm rounded-4 border-top border-primary border-4 mt-4 overflow-hidden'>
          <div className='card-header bg-white border-0 pt-4 pb-0 px-4 px-md-5 d-flex justify-content-between align-items-center'>
            <h5 className='fw-bold mb-0 text-primary'>
              <i className='bi bi-robot me-2'></i> AI Interview Preparation
            </h5>
            <button
              className='btn btn-outline-primary rounded-pill fw-medium btn-sm px-3'
              onClick={handleGeneratePrep}
              disabled={aiStatus === "loading"}>
              {aiStatus === "loading" ? "Generating..." : "Generate Guide"}
            </button>
          </div>
          <div className='card-body p-4 p-md-5'>
            {aiStatus === "idle" && !interviewPrepResult && (
              <div className='text-center text-muted py-4'>
                <i className='bi bi-magic fs-1 mb-2 d-block text-primary opacity-50'></i>
                <p>
                  Generate personalized interview questions and tips based on
                  this job's requirements.
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
                <i className='bi bi-exclamation-triangle-fill me-2'></i> Failed
                to generate AI preparation. Please try again.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};