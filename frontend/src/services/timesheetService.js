
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create reusable axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: global response handler (recommended)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(
      error.response?.data || { message: "Network error" }
    );
  }
);

export const timesheetApi = {
  // Fetch all records (with filters / pagination)
  getTimesheets: (params = {}) =>
    api.get("/timesheets/get", { params }),

  // Add a single record
  createTimesheet: (data) =>
    api.post("/timesheets/create", data),

  // Update a single entry
  updateTimesheet: (id, data) =>
    api.put(`/timesheets/update/${id}`, data),

  // Bulk Import (CSV / Excel)
  importTimesheets: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/timesheets/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete entry
  deleteTimesheet: (id) =>
    api.delete(`/timesheets/delete/${id}`),
};
