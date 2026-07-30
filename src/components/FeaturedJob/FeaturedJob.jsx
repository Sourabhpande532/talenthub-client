import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchJobs } from "../../features/jobs/jobSlice";
import JobCard from "../JobCard/JobCard";

const FeaturedJob = () => {
  const { jobsList, status } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchJobs("?limit6"));
  }, [dispatch]);

  return (
    <section className='py-5 bg-body-tertiary'>
      <div className='container py-4'>
        <div className='d-flex justify-content-between align-items-end mb-4'>
          <div>
            <h2 className='fw-bold mb-1'>Featured Jobs</h2>
            <p className='text-muted mb-0'>
              Discover the latest opportunities added to TalentHub
            </p>
          </div>
          <Link to='#' className='btn btn-outline-primary fw-medium'>
            View All Jobs <i className='bi bi-arrow-right ms-1'></i>
          </Link>
        </div>
        {/* */}
        {status === "loading" ? (
          <div className='text-center py-5'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        ) : (
          <div className='row g-4'>
            {jobsList && jobsList.length > 0 ? (
              jobsList.slice(0, 6).map((job) => (
                <div key={job._id} className='col-md-6 col-lg-4'>
                  <JobCard job={job} hideBookmark={true} />
                </div>
              ))
            ) : (
              <div className='col-12 text-center py-5 text-muted'>
                <i className='bi bi-inbox fs-1 d-block mb-3'></i>
                <p>No jobs found at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
export { FeaturedJob };
