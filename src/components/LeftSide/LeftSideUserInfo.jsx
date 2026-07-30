import { Link } from "react-router-dom";

export const LeftSideUserInfo = ({ role, setRole }) => {
  return (
    <div className='col-lg-4 bg-primary text-white p-5 d-none d-lg-flex flex-column justify-content-center position-relative'>
      <h2 className='fw-bold mb-4'>Create your account</h2>
      <p className='mb-4 opacity-75'>
        Join TalentHub and take the next step in your career or hiring journey.
      </p>

      <div className='mt-4'>
        <p className='fw-medium mb-2'>I want to register as</p>

        <div
          className={`role-select-card mb-3 p-3 rounded-3 border border-2 ${role === "Applicant" ? "border-white bg-white text-primary" : "border-light text-white"}`}
          style={{ cursor: "pointer", transition: "all 0.2s" }}
          onClick={() => setRole("Applicant")}>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex align-items-center gap-3'>
              <i className='bi bi-person-workspace fs-3'></i>
              <div>
                <h6 className='mb-0 fw-bold'>Applicant</h6>
                <small className='opacity-75'>
                  Find jobs, apply and manage
                </small>
              </div>
            </div>
            <i
              className={`bi ${role === "Applicant" ? "bi-check-circle-fill" : "bi-circle"} fs-5`}></i>
          </div>
        </div>

        <div
          className={`role-select-card p-3 rounded-3 border border-2 ${role === "Recruiter" ? "border-white bg-white text-primary" : "border-light text-white"}`}
          style={{ cursor: "pointer", transition: "all 0.2s" }}
          onClick={() => setRole("Recruiter")}>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex align-items-center gap-3'>
              <i className='bi bi-building fs-3'></i>
              <div>
                <h6 className='mb-0 fw-bold'>Recruiter</h6>
                <small className='opacity-75'>Post jobs, find talent</small>
              </div>
            </div>
            <i
              className={`bi ${role === "Recruiter" ? "bi-check-circle-fill" : "bi-circle"} fs-5`}></i>
          </div>
        </div>
      </div>

      <div className='mt-auto pt-5'>
        <p className='small mb-0'>
          Already have an account?{" "}
          <Link to='/login' className='text-white fw-bold'>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};