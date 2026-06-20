import axios from 'axios';

// Create a centralized Axios instance
const apiClient = axios.create({
  // In a production app, this would be an environment variable (e.g., import.meta.env.VITE_API_URL)
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches the paginated and filtered list of employees.
 */
export const fetchEmployees = async (params = { page: 1, limit: 10 }) => {
  try {
    const response = await apiClient.get('/employees', { params });
    return response.data; // Returns { success, data, meta }
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error.response?.data?.error || new Error('Failed to fetch employees');
  }
};

/**
 * Fetches the high-level payroll analytics.
 */
export const fetchAnalytics = async () => {
  try {
    const response = await apiClient.get('/analytics');
    return response.data; // Returns { success, data }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error.response?.data?.error || new Error('Failed to fetch analytics');
  }
};