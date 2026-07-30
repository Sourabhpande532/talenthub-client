import { Link } from "react-router-dom";

const FeaturedJob = () => {
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
        {/*  */}
      </div>
    </section>
  );
};
export { FeaturedJob };
