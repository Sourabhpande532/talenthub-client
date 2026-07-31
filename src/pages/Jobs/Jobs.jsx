import { FilterSidebar } from "../../components/FilterSidebar/FilterSidebar";
import JobCard from "../../components/JobCard/JobCard";
import { useFilterMechanism } from "../../hooks/useFilterMechanism";

const Jobs = () => {
  const { filters, handleFilterChange, handleClearFilters, jobsList, status } =
    useFilterMechanism();
  return (
    <div className='jobs-page bg-body-tertiary min-vh-100 py-4'>
      <div className='container'>
        {/* Main Search Bar */}
        <div className='card border-0 shadow-sm rounded-4 mb-4'>
          <div className='card-body p-2 p-md-3 d-flex flex-wrap gap-2 align-items-center'>
            <div className='flex-grow-1 position-relative'>
              <i className='bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted'></i>
              <input
                type='text'
                name='search'
                className='form-control border-0 bg-body-tertiary rounded-pill ps-5 py-2 text-body'
                placeholder='Search jobs, skills, or companies...'
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <div className='d-flex align-items-center gap-2 px-3 border-start'>
              <span className='text-muted small fw-medium text-nowrap'>
                Sort by:
              </span>
              <select
                name='sort'
                className='form-select border-0 shadow-none fw-medium text-primary bg-transparent'
                value={filters.sort}
                onChange={handleFilterChange}>
                <option value='latest'>Most Recent</option>
                <option value='salary-desc'>Highest Salary</option>
              </select>
            </div>
          </div>
        </div>

        <div className='row g-4'>
          {/* Filters Sidebar */}
          <FilterSidebar />
          {/* Job Listings */}
          <div className='col-lg-9'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <h4 className='fw-bold mb-0'>All Jobs</h4>
              <span className='badge bg-primary rounded-pill px-3 py-2 fw-normal fs-6'>
                {jobsList?.length || 0} jobs found
              </span>
            </div>

            {status === "loading" ? (
              <div className='text-center py-5'>
                <div
                  className='spinner-border text-primary'
                  role='status'></div>
                <p className='mt-3 text-muted'>Searching for jobs...</p>
              </div>
            ) : jobsList && jobsList.length > 0 ? (
              <div className='row g-4'>
                {jobsList.map((job) => (
                  <div key={job._id} className='col-md-6'>
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <div className='card border-0 shadow-sm rounded-4 text-center py-5'>
                <div className='card-body py-5'>
                  <i className='bi bi-search fs-1 text-muted mb-3 d-block'></i>
                  <h5 className='fw-bold'>No jobs found</h5>
                  <p className='text-muted'>
                    Try adjusting your search or filters to find what you're
                    looking for.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className='btn btn-outline-primary mt-2 rounded-pill fw-medium px-4'>
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
