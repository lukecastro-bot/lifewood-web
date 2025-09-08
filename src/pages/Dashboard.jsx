import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 🔹 show 10 rows per page

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("https://lifewood-web.onrender.com/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        } else {
          toast.error("Failed to fetch applications");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching applications");
      }
    };
    fetchApplications();
  }, []);

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredApps.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Resume</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="p-3">{app.name}</td>
                  <td className="p-3">{app.email}</td>
                  <td className="p-3 capitalize">{app.status}</td>
                  <td className="p-3">
                    <a
                      href={`https://lifewood-web.onrender.com/api/applications/${app.id}/resume`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="p-3 space-x-2">
                    {app.status === "pending" && (
                      <>
                        <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          Accept
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          Decline
                        </button>
                      </>
                    )}
                    {(app.status === "accepted" || app.status === "declined") && (
                      <span className="text-gray-500 italic">Finalized</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
