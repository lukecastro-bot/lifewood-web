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

  // Search, filter, sort
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

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

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );

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

  // --- Sorting, Filtering, Searching ---
  const filteredApps = applications
    .filter((app) => {
      if (filterStatus === "ALL") return true;
      return app.status === filterStatus;
    })
    .filter(
      (app) =>
        app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortField]?.toString().toLowerCase();
      const valB = b[sortField]?.toString().toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

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

      {/* Controls */}
      <div className="p-6 flex flex-wrap gap-4 items-center bg-white shadow-md m-6 rounded-xl">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="DECLINED">Declined</option>
        </select>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="id">Sort by ID</option>
          <option value="firstName">Sort by Name</option>
          <option value="age">Sort by Age</option>
          <option value="status">Sort by Status</option>
        </select>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {sortOrder === "asc" ? "⬆ Asc" : "⬇ Desc"}
        </button>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {loading && <p>Loading applications...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-green-100 text-gray-700">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Age</th>
                  <th className="px-4 py-2 border">Degree</th>
                  <th className="px-4 py-2 border">Experience</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Project</th>
                  <th className="px-4 py-2 border">Resume</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} className="text-center hover:bg-gray-50">
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
                    <td className="px-4 py-2 border">{app.age}</td>
                    <td className="px-4 py-2 border">{app.degree}</td>
                    <td className="px-4 py-2 border">{app.experience}</td>
                    <td className="px-4 py-2 border">{app.email}</td>
                    <td className="px-4 py-2 border">{app.project}</td>
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
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan="10" className="py-4 text-gray-500">
                      No applications found
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
