import "./Stats.css"
const FeatureStats = () => {
  return (
    <section className='py-5'>
      <div className='container py-4'>
        <div className='row g-4 text-center'>
          <div className='col-md-4'>
            <div className='p-4 bg-light rounded-4 h-100'>
              <i className='bi bi-robot fs-1 text-primary mb-3'></i>
              <h4 className='fw-bold'>AI Interview Prep</h4>
              <p className='text-muted'>
                Get tailored interview questions and preparation tips generated
                instantly for any job.
              </p>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='p-4 bg-light rounded-4 h-100'>
              <i className='bi bi-briefcase fs-1 text-primary mb-3'></i>
              <h4 className='fw-bold'>Top Companies</h4>
              <p className='text-muted'>
                Connect with industry leaders and fast-growing startups looking
                for your skills.
              </p>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='p-4 bg-light rounded-4 h-100'>
              <i className='bi bi-chat-square-text fs-1 text-primary mb-3'></i>
              <h4 className='fw-bold'>AI Hiring Assistant</h4>
              <p className='text-muted'>
                Recruiters can chat with our AI to instantly analyze applicant
                profiles and find the best match.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export {FeatureStats}