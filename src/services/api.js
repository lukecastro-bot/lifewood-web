import axios from "axios";

const API = axios.create({
  baseURL: "https://lifewood-web.onrender.com/api", // ✅ updated base URL
});

// Get all applications
export const getApplications = () => API.get("/applications");

// Add a new application
export const createApplication = (data) => API.post("/applications", data);

// Update an application
export const updateApplication = (id, data) =>
  API.put(`/applications/${id}`, data);

// Delete an application
export const deleteApplication = (id) =>
  API.delete(`/applications/${id}`);
