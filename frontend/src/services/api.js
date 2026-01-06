const API_URL = 'http://localhost:5000/api'; // Adjust to your backend port

export const api = {
  // Fetch all timesheets
  getTimesheets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/timesheets/get?${queryString}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
  // Update a single entry (Inline Edit)
  updateTimesheet: async (id, data) => {
    const response = await fetch(`${API_URL}/timesheets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Bulk Import
  importTimesheets: async (formData) => {
    const response = await fetch(`${API_URL}/timesheets/import`, {
      method: 'POST',
      body: formData, // Multer handles this
    });
    return response.json();
  },

  // Delete entry
  deleteTimesheet: async (id) => {
    const response = await fetch(`${API_URL}/timesheets/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};