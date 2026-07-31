import { useParams, Link } from "react-router-dom";
import "./JobDetails.css";
import { JobDetailsPrepPanel } from "../../components/JobDetailPrepPanel/JobDetailsPrepPanel";
import { JobDetailsSidePanel } from "../../components/JobDetailsSidePanel/JobDetailsSidePanel";


const JobDetails = () => {
  const { id } = useParams();
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
      </div>
    </div>
  );
};

export default JobDetails;
