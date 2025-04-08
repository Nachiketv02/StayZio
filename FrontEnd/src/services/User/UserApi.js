import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/stayzio/user`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const registerUser = async (formData) => {
  try {
    const response = await api.post("/register", formData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Registration failed. Please try again.";
    throw new Error(errorMessage);
  }
};

export const verifyOTP = async (email, verificationCode ) => {
  try {
    const response = await api.post("/verify", { email, verificationCode });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Verification failed. Please try again.";
    throw new Error(errorMessage);
  }
};

export const login = async (formData) => {
  try {
    const response = await api.post("/login", formData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage =
      error.response?.data?.message 
      // error.message ||
      // "Login failed. Please try again.";
    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Logout failed. Please try again.";
    throw new Error(errorMessage);
  }
};

export const resendOTP = async (email) => {
  try {
    const response = await api.post("/resendOtp", { email });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to resend OTP. Please try again.";
    throw new Error(errorMessage);
  }
};

export const forgotPassword = async (formData) => {
  try {
    const response = await api.post("/forgotPassword", formData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to send reset password email. Please try again.";
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (password, confirmPassword, token) => {
  try {
    console.log(password, confirmPassword, token);
    const response = await api.put(`/reset-password/${token}`, { password, confirmPassword });
    console.log(response);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to reset password. Please try again.";
    throw new Error(errorMessage);
  }
};

// Property Listing

export const listProperty = async (formData) => {
  try {
    const response = await api.post("/list-property", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to list property. Please try again.";
    if (error.response) {
      if (error.response.data?.errors) {
        errorMessage = error.response.data.errors
          .map(err => err.msg)
          .join(', ');
      } 
      else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};



