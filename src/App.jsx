import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import ApplicationForm from "./components/ApplicationForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Success from "./pages/Success.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import "./index.css";

// ✅ Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link
          to="/"
          className="text-[#3b7a57] font-extrabold text-2xl tracking-wide hover:text-[#ff914d] transition-colors duration-300"
        >
          Lifewood
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-[#3b7a57] font-medium hover:text-[#ff914d] transition-colors">Home</Link>
          <Link to="/about" className="text-[#3b7a57] font-medium hover:text-[#ff914d] transition-colors">About</Link>
          <Link to="/projects" className="text-[#3b7a57] font-medium hover:text-[#ff914d] transition-colors">Projects</Link>
        </div>

        {/* Right Side */}
        <div className="flex space-x-4">
          <Link
            to="/admin-login"
            className="px-4 py-2 border border-[#ff914d] text-[#ff914d] rounded-lg hover:bg-[#ff914d] hover:text-white transition-colors font-semibold"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

// ✅ Wrapper to handle navbar visibility
const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {isDashboard ? (
        // 🚀 Dashboard has NO navbar
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      ) : (
        // 🚀 All other pages have navbar + padding
        <>
          <Navbar />
          <div className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/apply" element={<ApplicationForm />} />
              <Route path="/success" element={<Success />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
