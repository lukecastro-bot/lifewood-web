// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // ✅ fixed: added /api
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
