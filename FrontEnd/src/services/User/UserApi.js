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
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Login failed. Please try again.";
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

export const getAllProperties = async () => {
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

export const getMyProperties = async () => {
  try {
    const response = await api.get("/my-properties");
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch properties. Please try again.";
    throw new Error(errorMessage);
  }
};

export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/property/${id}`);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch property. Please try again.";
    throw new Error(errorMessage);
  }
};

export const updateProperty = async (id, formData) => {
  try {
    const response = await api.put(`/property/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data.data);
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data.data;
  } catch (error) {
    let errorMessage = "Failed to update property. Please try again.";
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

export const deleteProperty = async (id) => {
  try {
    const response = await api.delete(`/property/${id}`);
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete property. Please try again.";
    throw new Error(errorMessage);
  }
};

// Booking

export const createBooking = async (formData) => {
  try {
    const response = await api.post("/book-property", formData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create booking. Please try again.";
    throw new Error(errorMessage);
  }
};

export const getPropertyBookings = async (id) => {
  try {
    const response = await api.get(`/property/${id}/bookings`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch property bookings. Please try again.";
    throw new Error(errorMessage);
  }
};

export const getMyBookings = async () => {
  try {
    const response = await api.get("/my-bookings");
    console.log(response.data.bookings);
    return response.data.bookings;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch bookings. Please try again.";
    throw new Error(errorMessage);
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await api.delete(`/my-bookings/${id}`);
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete booking. Please try again.";
    throw new Error(errorMessage);
  }
};

//review

export const createReview = async (formData) => {
  try {
    const response = await api.post("/review", formData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create review. Please try again.";
    throw new Error(errorMessage);
  }
};

export const getPropertyReviews = async (id) => {
  try {
    const response = await api.get(`/property/${id}/reviews`);
    return response.data.reviews;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch reviews. Please try again.";
    throw new Error(errorMessage);
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/review/${id}`);
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete review. Please try again.";
    throw new Error(errorMessage);
  }
};

//Favorite

export const addFavorite = async (propertyId) => {
  try {
    const response = await api.post("/favorite", { propertyId });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to add favorite. Please try again.";
    throw new Error(errorMessage);
  }
};

export const getFavorites = async () => {
  try {
    const response = await api.get("/favorite");
    return response.data.favorites;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch favorites. Please try again.";
    throw new Error(errorMessage);
  }
};

export const removeFavorite = async (propertyId) => {
  try {
    const response = await api.delete(`/favorite/${propertyId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to remove favorite. Please try again.";
    throw new Error(errorMessage);
  }
};



