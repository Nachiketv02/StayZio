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
    console.log(response.data);
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
