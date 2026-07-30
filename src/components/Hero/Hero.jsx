import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css"
const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/jobs");
    }
  };
  return (
    <section className='hero-section bg-primary text-white text-center py-5'>
      <div className='container py-5'>
        <h1 className='display-4 fw-bold mb-4'>Find Your Dream Job with AI</h1>
        <p
          className='lead mb-5 opacity-75 mx-auto'
          style={{ maxWidth: "600px" }}>
          TalentHub connects top talent with incredible opportunities using the
          power of Artificial Intelligence to guide your hiring or job search
          journey.
        </p>

        <form
          onSubmit={handleSearch}
          className='search-form mx-auto bg-body-tertiary p-2 rounded-pill shadow-sm border border-secondary border-opacity-25 d-flex align-items-center'
          style={{ maxWidth: "700px" }}>
          <i className='bi bi-search text-muted ms-3 me-2'></i>
          <input
            type='text'
            className='form-control border-0 bg-transparent shadow-none text-body'
            placeholder='Search jobs, companies, or skills...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type='submit'
            className='btn btn-primary rounded-pill px-4 fw-medium'>
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export { Hero };
