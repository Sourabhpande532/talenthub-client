import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

import ProtectingRoutes from "./routes/ProtectingRoutes";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import "./App.css";

const Landing = lazy(() => import("./pages/Landing/Landing"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const Jobs = lazy(() => import("./pages/Jobs/Jobs"));
const JobDetails = lazy(() => import("./pages/JobDetails/JobDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const CreateJob = lazy(() => import("./pages/CreateJob/CreateJob"));

const PageLoader = () => (
  <div className="flex-1 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 p-6">
    <span className="inline-block w-9 h-9 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></span>
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
      Loading TalentHub...
    </span>
  </div>
);

const NotFound = () => (
  <div className="flex-1 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 px-4 py-12 text-center">
    <div className="w-16 h-16 rounded-2xl bg-navy-900 text-white flex items-center justify-center text-2xl mb-4 shadow-sm">
      <i className="bi bi-compass"></i>
    </div>
    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
      404 — Page Not Found
    </h1>
    <p className="text-sm text-slate-600 max-w-md mb-6">
      The page you are looking for does not exist or may have been moved.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold no-underline transition-colors"
      >
        Back to Home
      </Link>
      <Link
        to="/jobs"
        className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold no-underline transition-colors"
      >
        Browse Jobs
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <Toaster
          position="top-right"
          reverseOrder={true}
          toastOptions={{
            className: "text-sm font-medium rounded-xl shadow-lg",
            duration: 3500,
          }}
        />
        <ToastContainer position="top-right" autoClose={3000} />

        <main className="flex-1 flex flex-col">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />

              {/* Protected Routes - Accessible by any logged-in user */}
              <Route
                path="/dashboard"
                element={
                  <ProtectingRoutes>
                    <Dashboard />
                  </ProtectingRoutes>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectingRoutes>
                    <Profile />
                  </ProtectingRoutes>
                }
              />

              {/* Protected Routes - Recruiter Only */}
              <Route
                path="/create-job"
                element={
                  <ProtectingRoutes requiredRole="Recruiter">
                    <CreateJob />
                  </ProtectingRoutes>
                }
              />
              <Route
                path="/edit-job/:id"
                element={
                  <ProtectingRoutes requiredRole="Recruiter">
                    <CreateJob />
                  </ProtectingRoutes>
                }
              />

              {/* 404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
