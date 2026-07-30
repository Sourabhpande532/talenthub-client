import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/header/Header";
import ProtectingRoutes from "./routes/ProtectingRoutes";
import { Dashboard, Landing, Login, Register, Reports } from "./pages";
function App() {
  return (
    <BrowserRouter className=''>
      <Header />
      <Toaster position='top-right' reverseOrder={true} />
      <ToastContainer position='top-right' autoClose={3000} />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/dashboard'
          element={
            <ProtectingRoutes>
              <Dashboard />
            </ProtectingRoutes>
          }
        />
        <Route
          path='/report'
          element={
            <ProtectingRoutes>
              <Reports />
            </ProtectingRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
