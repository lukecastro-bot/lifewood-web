import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const ApplicationForm = () => {
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    degree: "",
    experience: "",
    email: "",
    project: "",
  });

  const [resumeFile, setResumeFile] = useState(null);

  // Pre-fill project if coming from Projects page
  useEffect(() => {
    if (location.state && location.state.project) {
      setFormData((prev) => ({
        ...prev,
        project: location.state.project,
      }));
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      toast.error("Please upload your resume.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    payload.append("resume", resumeFile);

    try {
      const res = await fetch("http://localhost:8080/api/apply", {
        method: "POST",
        body: payload, // Let FormData handle Content-Type
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to submit: ${res.status} ${errorText}`);
      }

      toast.success("Application submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        degree: "",
        experience: "",
        email: "",
        project: "",
      });
      setResumeFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Internal Server Error");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Application Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          className="border rounded px-2 py-1 w-full"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          className="border rounded px-2 py-1 w-full"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          className="border rounded px-2 py-1 w-full"
          required
        />
        <input
          type="text"
          placeholder="Degree"
          value={formData.degree}
          onChange={(e) =>
            setFormData({ ...formData, degree: e.target.value })
          }
          className="border rounded px-2 py-1 w-full"
          required
        />
        <input
          type="text"
          placeholder="Experience"
          value={formData.experience}
          onChange={(e) =>
            setFormData({ ...formData, experience: e.target.value })
          }
          className="border rounded px-2 py-1 w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="border rounded px-2 py-1 w-full"
          required
        />
        <input
          type="text"
          placeholder="Project"
          value={formData.project}
          readOnly
          className="border rounded px-2 py-1 w-full bg-gray-100"
        />

        <div>
          <label className="block mb-1">Upload Resume (PDF/DOC/DOCX):</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
