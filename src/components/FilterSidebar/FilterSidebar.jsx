import { useFilterMechanism } from "../../hooks/useFilterMechanism";

export const FilterSidebar = () => {
  const { handleClearFilters, filters, handleFilterChange } =
    useFilterMechanism();
  return (
    <div className='col-lg-3'>
      <div
        className='card border-0 shadow-sm rounded-4 position-sticky mb-5 pb-2'
        style={{ top: "100px", minHeight: "80vh" }}>
        <div className='card-body p-4'>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h5 className='fw-bold mb-0'>Filters</h5>
            <button
              onClick={handleClearFilters}
              className='btn btn-link text-decoration-none p-0 small fw-medium'>
              Clear all
            </button>
          </div>

          <div className='mb-4'>
            <h6 className='fw-bold mb-3 small text-muted text-uppercase'>
              Location
            </h6>
            <select
              name='location'
              className='form-select bg-body-tertiary text-body border-secondary border-opacity-25'
              value={filters.location}
              onChange={handleFilterChange}>
              <option value=''>Any Location</option>
              <option value='Remote'>Remote Only</option>
              <option value='Bangalore'>Bangalore</option>
              <option value='Hyderabad'>Hyderabad</option>
              <option value='Pune'>Pune</option>
              <option value='Mumbai'>Mumbai</option>
            </select>
          </div>

          <div className='mb-4'>
            <h6 className='fw-bold mb-3 small text-muted text-uppercase'>
              Experience
            </h6>
            <div className='d-flex flex-column gap-2'>
              {["Fresher", "1-3 Yrs", "3-5 Yrs", "5+ Yrs"].map((exp) => (
                <div className='form-check' key={exp}>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='experience'
                    id={exp}
                    value={exp}
                    checked={filters.experience === exp}
                    onChange={handleFilterChange}
                  />
                  <label
                    className='form-check-label text-secondary'
                    htmlFor={exp}>
                    {exp === "Fresher"
                      ? "0 - 1 years"
                      : exp.replace("Yrs", "years")}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className='mb-5 pb-5'>
            <h6 className='fw-bold mb-3 small text-muted text-uppercase'>
              Salary Range
            </h6>
            <select
              name='salary'
              className='form-select bg-body-tertiary text-body border-secondary border-opacity-25'
              value={filters.salary}
              onChange={handleFilterChange}>
              <option value=''>Any Salary</option>
              <option value='5'>5+ LPA</option>
              <option value='10'>10+ LPA</option>
              <option value='15'>15+ LPA</option>
              <option value='20'>20+ LPA</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
