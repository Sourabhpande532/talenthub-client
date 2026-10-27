import React, { useState } from "react";
import "./Register.css";
import { LeftSideUserInfo } from "../../components/LeftSide/LeftSideUserInfo";
import { RightSideUserForm } from "../../components/RightSide/RightSideUserForm";

const Register = () => {
  const [role, setRole] = useState("Applicant");
  return (
    <main className="auth-page bg-slate-50 min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Side Info (Desktop) */}
          <LeftSideUserInfo role={role} setRole={setRole} />
          {/* Right Side Form */}
          <RightSideUserForm role={role} setRole={setRole} />
        </div>
      </div>
    </main>
  );
};

export default Register;
