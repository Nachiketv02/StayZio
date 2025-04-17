import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaMoneyBillWave,
  FaCheckCircle,
  FaSpinner,
  FaStar,
  FaTimes,
  FaBan,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  getMyBookings,
  createReview,
  deleteBooking,
} from "../services/User/UserApi";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setIsCancelling(true);
    try {
      await deleteBooking(selectedBooking._id);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === selectedBooking._id
            ? {
                ...booking,
                status: "cancelled",
                cancelledAt: new Date().toISOString(),
              }
            : booking
        )
      );
      setShowCancelModal(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setError("Failed to cancel booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (review.rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (review.comment.length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        propertyId: selectedBooking.propertyId._id,
        bookingId: selectedBooking._id,
        rating: review.rating,
        comment: review.comment,
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBooking._id
            ? { ...booking, reviewed: true }
            : booking
        )
      );

      setShowReviewModal(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <FaSpinner className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Loading your bookings...
          </h2>
        </motion.div>
      </div>
    );
  }

  const today = new Date();
  const getFilteredBookings = () => {
    switch (filter) {
      case "active":
        return bookings.filter(
          (booking) =>
            booking.status !== "cancelled" &&
            new Date(booking.checkIn) <= today &&
            new Date(booking.checkOut) >= today
        );
      case "upcoming":
        return bookings.filter(
          (booking) =>
            booking.status !== "cancelled" && new Date(booking.checkIn) > today
        );
      case "past":
        return bookings.filter(
          (booking) =>
            booking.status !== "cancelled" && new Date(booking.checkOut) < today
        );
      case "cancelled":
        return bookings.filter((booking) => booking.status === "cancelled");
      default:
        return bookings;
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Bookings
          </h1>
          <p className="text-gray-600">
            Manage and view all your booking details in one place
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {["active", "upcoming", "past", "cancelled"].map((filterType) => (
            <motion.button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap ${
                filter === filterType
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          <AnimatePresence>
            {getFilteredBookings().map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <img
                      src={booking.propertyId.images[0].url}
                      alt={booking.propertyId.title}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.propertyId.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : new Date(booking.checkIn) > today
                              ? "bg-blue-100 text-blue-800"
                              : new Date(booking.checkOut) < today
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {booking.status === "cancelled"
                            ? "Cancelled"
                            : new Date(booking.checkIn) > today
                            ? "Upcoming"
                            : new Date(booking.checkOut) < today
                            ? "Past"
                            : "Active"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="w-5 h-5 mr-2 text-gray-400" />
                          <span>{booking.propertyId.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaUsers className="w-5 h-5 mr-2 text-gray-400" />
                          <span>{booking.guests} Guests</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="w-5 h-5 mr-2 text-gray-400" />
                          <span>
                            {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaMoneyBillWave className="w-5 h-5 mr-2 text-gray-400" />
                          <span>
                            ₹{booking.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center">
                          {booking.status === "cancelled" ? (
                            <div className="flex items-center text-red-600">
                              <FaBan className="w-5 h-5 mr-2" />
                              <span>Booking Cancelled</span>
                              {booking.cancelledAt && (
                                <span className="ml-2 text-sm text-gray-500">
                                  on{" "}
                                  {new Date(
                                    booking.cancelledAt
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : new Date(booking.checkOut) < today ? (
                            <div className="flex items-center bg-[#F3F4F6] rounded-full px-4 py-2 text-sm">
                              <FaCheckCircle className="w-5 h-5 mr-2 text-sm" />
                              <span>Completed</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-green-600">
                              <FaCheckCircle className="w-5 h-5 mr-2" />
                              <span>Booking Confirmed</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {new Date(booking.checkOut) < today &&
                            !booking.reviewed &&
                            booking.status !== "cancelled" && (
                              <motion.button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowReviewModal(true);
                                }}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaStar className="mr-2" />
                                Write Review
                              </motion.button>
                            )}
                          {new Date(booking.checkOut) < today &&
                            booking.reviewed && (
                              <span className="ml-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium flex items-center">
                                <FaStar className="mr-1" />
                                Reviewed
                              </span>
                            )}
                          {new Date(booking.checkIn) > today &&
                            booking.status !== "cancelled" && (
                              <motion.button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCancelModal(true);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaBan className="mr-2" />
                                Cancel Booking
                              </motion.button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {getFilteredBookings().length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-sm"
            >
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500">
                {filter === "upcoming"
                  ? "You don't have any upcoming bookings"
                  : filter === "past"
                  ? "You don't have any past bookings"
                  : filter === "cancelled"
                  ? "You don't have any cancelled bookings"
                  : "You don't have any active bookings"}
              </p>
            </motion.div>
          )}
        </div>

        {/* Cancel Booking Modal */}
        <AnimatePresence>
          {showCancelModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-lg w-full"
              >
                <div className="flex items-center mb-6">
                  <FaExclamationTriangle className="w-12 h-12 text-red-500 mr-4" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Cancel Booking
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Are you sure you want to cancel this booking? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Booking Details:
                  </h4>
                  <p className="text-gray-600">
                    {selectedBooking?.propertyId.title}
                    <br />
                    Check-in:{" "}
                    {new Date(selectedBooking?.checkIn).toLocaleDateString()}
                    <br />
                    Check-out:{" "}
                    {new Date(selectedBooking?.checkOut).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCancelModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    disabled={isCancelling}
                  >
                    Keep Booking
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelBooking}
                    disabled={isCancelling}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center"
                  >
                    {isCancelling ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <FaBan className="mr-2" />
                        Cancel Booking
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-lg w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Write a Review
                  </h3>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Rate your experience</p>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setReview({ ...review, rating: star })}
                        className={`text-2xl ${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        <FaStar />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={4}
                    placeholder="Share your experience..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {review.comment.length}/500 characters
                  </p>
                </div>

                {error && (
                  <div className="mb-4 text-red-600 text-sm">{error}</div>
                )}

                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MyBookings;
