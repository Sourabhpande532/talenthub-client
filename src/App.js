import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

import ProtectingRoutes from "./routes/ProtectingRoutes";
import {
  CreateJob,
  Dashboard,
  JobDetails,
  Jobs,
  Landing,
  Login,
  Profile,
  Register,
} from "./pages";
import { Navbar } from "./components/Navbar/Navbar";
function App() {
  return (
    <BrowserRouter className=''>
      <Navbar />
      <Toaster position='top-right' reverseOrder={true} />
      <ToastContainer position='top-right' autoClose={3000} />
      {/* Public Routes */}
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/jobs/:id' element={<JobDetails />} />

        {/* Protected Routes - Accessible by any logged-in user */}
        <Route
          path='/dashboard'
          element={
            <ProtectingRoutes>
              <Dashboard />
            </ProtectingRoutes>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectingRoutes>
              <Profile />
            </ProtectingRoutes>
          }
        />
        {/* Protected Routes - Recruiter Only */}
        <Route
          path='/create-job'
          element={
            <ProtectingRoutes requiredRole='Recruiter'>
              <CreateJob />
            </ProtectingRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
