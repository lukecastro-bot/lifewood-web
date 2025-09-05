import React from "react";
import { useLocation, Link } from "react-router-dom";

function Success() {
  const location = useLocation();
  const project = location.state?.project;

  return (
    <div className="min-h-screen bg-lifewood-beige flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-lifewood-green mb-4">
          Application Submitted!
        </h1>
        {project && (
          <p className="mb-6">
            Your application for <strong>{project}</strong> has been received.
          </p>
        )}
        <Link
          to="/"
          className="bg-[#3b7a57] text-white px-6 py-3 rounded-xl shadow hover:bg-[#ff914d] transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Success;
