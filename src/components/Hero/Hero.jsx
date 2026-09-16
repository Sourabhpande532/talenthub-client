import { useState } from "react";
import { useNavigate } from "react-router-dom";

const heroStyles = {
  section: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f4f7fb",
    borderBottom: "1px solid #dbe4f0",
  },

  container: {
    position: "relative",
    zIndex: 1,
  },

  heading: {
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
    lineHeight: 1.15,
    color: "#172033",
    letterSpacing: "-1px",
  },

  description: {
    maxWidth: "620px",
    fontSize: "1.1rem",
    lineHeight: 1.7,
    color: "#526174",
  },

  searchForm: {
    maxWidth: "700px",
    backgroundColor: "#ffffff",
    border: "1px solid #d9e2ef",
  },

  searchIcon: {
    color: "#64748b",
    fontSize: "1.05rem",
  },

  input: {
    color: "#172033",
    outline: "none",
    boxShadow: "none",
  },

  searchButton: {
    backgroundColor: "#2563a8",
    borderColor: "#2563a8",
    minWidth: "100px",
  },

  features: {
    color: "#64748b",
    fontSize: "0.9rem",
  },

  featureIcon: {
    color: "#3b82c4",
  },

  topShape: {
    position: "absolute",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    backgroundColor: "#e3edf8",
    top: "-110px",
    right: "-60px",
    opacity: 0.8,
  },

  bottomShape: {
    position: "absolute",
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    backgroundColor: "#eaf1f9",
    bottom: "-80px",
    left: "-40px",
  },
};

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
    <section className='text-center py-5' style={heroStyles.section}>
      {/* Decorative shapes */}
      <div style={heroStyles.topShape} />

      <div style={heroStyles.bottomShape} />

      <div className='container py-5' style={heroStyles.container}>
        <h1 className='fw-bold mb-4' style={heroStyles.heading}>
          Find Tech Roles That Fit Your Craft
        </h1>

        <p
          className='hero-subline lead mb-5 mx-auto opacity-90'
          style={{ maxWidth: "640px" }}>
          Explore curated engineering, product, and design positions. Get
          AI-powered preparation guides and apply directly to top hiring teams.
        </p>

        <form
          onSubmit={handleSearch}
          className='mx-auto p-2 d-flex align-items-center rounded-pill shadow-sm'
          style={heroStyles.searchForm}>
          <i className='bi bi-search ms-3 me-2' style={heroStyles.searchIcon} />

          <input
            type='text'
            className='form-control border-0 bg-transparent shadow-none'
            placeholder='Search jobs, companies, or skills...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={heroStyles.input}
          />

          <button
            type='submit'
            className='btn rounded-pill px-4 fw-semibold text-white'
            style={heroStyles.searchButton}>
            Search
          </button>
        </form>

        <div
          className='d-flex justify-content-center flex-wrap gap-3 mt-4'
          style={heroStyles.features}>
          <span>
            <i
              className='bi bi-check-circle me-1'
              style={heroStyles.featureIcon}
            />
            Find opportunities
          </span>

          <span>
            <i
              className='bi bi-check-circle me-1'
              style={heroStyles.featureIcon}
            />
            Explore companies
          </span>

          <span>
            <i
              className='bi bi-check-circle me-1'
              style={heroStyles.featureIcon}
            />
            Build your career
          </span>
        </div>
      </div>
    </section>
  );
};

export { Hero };
