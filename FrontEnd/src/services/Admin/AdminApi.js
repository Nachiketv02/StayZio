import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/stayzio/admin`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

//property listing

export const getProperties = async () => {
  try {
    const response = await api.get("/properties");
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch properties. Please try again.";
    throw new Error(errorMessage);
  }
};

export const createProperty = async(formData) => {
  try {
    const response = await api.post("/property", formData);
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create property. Please try again.";
    throw new Error(errorMessage);
  }
};

export const updateProperty = async (id, formData) => {
  try {
    const response = await api.put(`/property/${id}`, formData);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update property. Please try again.";
    throw new Error(errorMessage);
  }
};

export const deleteProperty = async (id) => {
  try {
    const response = await api.delete(`/property/${id}`);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete property. Please try again.";
    throw new Error(errorMessage);
  }
};

//User

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch users. Please try again.";
    throw new Error(errorMessage);
  }
};

export const updateUser = async (id, formData) => {
  try {
    const response = await api.put(`/user/${id}`, formData);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update user. Please try again.";
    throw new Error(errorMessage);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/user/${id}`);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete user. Please try again.";
    throw new Error(errorMessage);
  }
};

//Booking

export const getAllBookings = async () => {
  try {
    const response = await api.get("/bookings");
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch bookings. Please try again.";
    throw new Error(errorMessage);
  }
};

//Dashboard

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch dashboard stats. Please try again.";
    throw new Error(errorMessage);
  }
};

//Reports

export const getReports = async (timeRange, reportType) => {
  try {
    const response = await api.get(`/reports?timeRange=${timeRange}&reportType=${reportType}`);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch reports. Please try again.";
    throw new Error(errorMessage);
  }
};

export const exportReport = async (timeRange, reportType, format = 'xlsx') => {
  try {
    // Make the API request with responseType: 'blob' for file downloads
    const response = await api.get(`/reports/export`, {
      params: { timeRange, reportType, format },
      responseType: 'blob' // This is crucial for file downloads
    });

    // Extract filename from content-disposition header or generate one
    const contentDisposition = response.headers['content-disposition'];
    let filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    let errorMessage = "Failed to export report. Please try again.";
    
    // Handle blob error responses (when server returns error as JSON)
    if (error.response?.data?.type?.includes('application/json')) {
      const errorText = await error.response.data.text();
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
    } else if (error.response?.data) {
      // Handle other error cases
      errorMessage = error.response.data.message || errorMessage;
    } else {
      errorMessage = error.message || errorMessage;
    }

    throw new Error(errorMessage);
  }
};