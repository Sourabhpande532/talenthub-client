import React, { useState } from "react";
import "../Register/Register.css";
import { LeftSideUserInfo } from "../../components/LeftSide/LeftSideUserInfo";
import { RightSideUserForm } from "../../components/RightSide/RightSideUserForm";


const Register = () => {
  const [role, setRole] = useState("Applicant");
  return (
    <div className='auth-page bg-body-tertiary min-vh-100 py-5'>
      <div className='container'>
        <div className='row g-0 bg-body rounded-4 shadow overflow-hidden'>
          {/* Left Side Info */}
          <LeftSideUserInfo role={role} setRole={setRole} />
          {/* Right Side Form */}
          <RightSideUserForm role={role} setRole={role} />
        </div>
      </div>
    </div>
  );
};

export default Register;
