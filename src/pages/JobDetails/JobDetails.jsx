import { useParams, Link } from "react-router-dom";
import "./JobDetails.css";
import { JobDetailsPrepPanel } from "../../components/JobDetailPrepPanel/JobDetailsPrepPanel";
import { JobDetailsSidePanel } from "../../components/JobDetailsSidePanel/JobDetailsSidePanel";
import { useSelector } from "react-redux";
import JobCard from "../../components/JobCard/JobCard";

const JobDetails = () => {
  const { id } = useParams();
  const {similarJobs} = useSelector((state)=>state.jobs);
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
          <JobDetailsPrepPanel id={id} />
          {/* Sidebar */}
          <JobDetailsSidePanel id={id} />
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
