// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Editing state
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({});

  // --- Fetch applications ---
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/admin-login");

      const res = await fetch("https://lifewood-web.onrender.com/api/applications", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      setError(err.message || "Failed to fetch applications");
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  // --- Update application status ---
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/admin-login");

    try {
      const res = await fetch(
  `https://lifewood-web.onrender.com/api/applications/${id}/status`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  }
);

      if (!res.ok) throw new Error("Failed to update status");

      setApplications((prev) => prev.filter((app) => app.id !== id));

      toast.success(
        status === "ACCEPTED"
          ? "✅ Application accepted"
          : "❌ Application declined"
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // --- Edit Application ---
  const handleEditClick = (app) => {
    setEditingApp(app.id);
    setFormData(app);
  };

  const handleCancelEdit = () => {
    setEditingApp(null);
    setFormData({});
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/admin-login");

    try {
      const res = await fetch(
  `https://lifewood-web.onrender.com/api/applications/${editingApp}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  }
);

      if (!res.ok) throw new Error("Failed to update application");

      const updated = await res.json();
      setApplications((prev) =>
        prev.map((app) => (app.id === editingApp ? updated : app))
      );

      toast.success("✅ Application updated");
      setEditingApp(null);
      setFormData({});
    } catch (err) {
      toast.error("Failed to update application");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="flex justify-between items-center bg-white shadow px-6 py-4 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-[#3b7a57]">Admin Dashboard</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-lg font-semibold mb-4">Applicants List</h2>

        {loading && <p>Loading applications...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Age</th>
                  <th className="px-4 py-2 border">Degree</th>
                  <th className="px-4 py-2 border">Experience</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Project</th>
                  <th className="px-4 py-2 border">Resume</th> {/* NEW */}
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="text-center">
                    <td className="px-4 py-2 border">{app.id}</td>
                    <td className="px-4 py-2 border">
                      {editingApp === app.id ? (
                        <input
                          value={formData.firstName || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          className="border rounded px-2"
                        />
                      ) : (
                        `${app.firstName} ${app.lastName}`
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {editingApp === app.id ? (
                        <input
                          value={formData.age || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, age: e.target.value })
                          }
                          className="border rounded px-2"
                        />
                      ) : (
                        app.age
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {editingApp === app.id ? (
                        <input
                          value={formData.degree || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, degree: e.target.value })
                          }
                          className="border rounded px-2"
                        />
                      ) : (
                        app.degree
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {editingApp === app.id ? (
                        <input
                          value={formData.experience || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              experience: e.target.value,
                            })
                          }
                          className="border rounded px-2"
                        />
                      ) : (
                        app.experience
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {editingApp === app.id ? (
                        <input
                          value={formData.email || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="border rounded px-2"
                        />
                      ) : (
                        app.email
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {editingApp === app.id ? (
                        <input
                          value={formData.project || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              project: e.target.value,
                            })
                          }
                          className="border rounded px-2"
                        />
                      ) : (
                        app.project
                      )}
                    </td>
                    {/* Resume column */}
                    <td className="px-4 py-2 border">
                      {app.resumePath ? (
                        <a
  href={`https://lifewood-web.onrender.com/${app.resumePath}`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 hover:underline"
>
  View Resume
</a>

                      ) : (
                        "No Resume"
                      )}
                    </td>
                    <td className="px-4 py-2 border">{app.status}</td>
                    <td className="px-4 py-2 border space-x-2">
                      {app.status === "PENDING" && (
                        <>
                          {editingApp === app.id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => updateStatus(app.id, "ACCEPTED")}
                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updateStatus(app.id, "DECLINED")}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleEditClick(app)}
                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan="10" className="py-4 text-gray-500">
                      No applications available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </div>
  );
};

export default Dashboard;
