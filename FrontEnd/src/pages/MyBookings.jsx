import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaMoneyBillWave, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { getMyBookings } from '../services/User/UserApi';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getFilteredBookings = () => {
    const today = new Date();
    switch (filter) {
      case 'upcoming':
        return bookings.filter(booking => new Date(booking.checkIn) >= today);
      case 'past':
        return bookings.filter(booking => new Date(booking.checkOut) < today);
      default:
        return bookings;
    }
  };

  const getStatusColor = (checkIn, checkOut) => {
    const today = new Date();
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (today < startDate) return 'bg-blue-100 text-blue-800'; // Upcoming
    if (today > endDate) return 'bg-gray-100 text-gray-800'; // Past
    return 'bg-green-100 text-green-800'; // Active
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
          <h2 className="text-xl font-semibold text-gray-800">Loading your bookings...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Bookings</h1>
          <p className="text-gray-600">Manage and view all your booking details in one place</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8">
          {['all', 'upcoming', 'past'].map((filterType) => (
            <motion.button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-full font-medium ${
                filter === filterType
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
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
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            booking.checkIn,
                            booking.checkOut
                          )}`}
                        >
                          {new Date(booking.checkIn) > new Date()
                            ? 'Upcoming'
                            : new Date(booking.checkOut) < new Date()
                            ? 'Completed'
                            : 'Active'}
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
                            {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaMoneyBillWave className="w-5 h-5 mr-2 text-gray-400" />
                          <span>₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center text-green-600">
                          <FaCheckCircle className="w-5 h-5 mr-2" />
                          <span>Booking Confirmed</span>
                        </div>
                        <motion.button
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
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
              className="text-center py-12"
            >
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
              <p className="text-gray-500">
                {filter === 'upcoming'
                  ? "You don't have any upcoming bookings"
                  : filter === 'past'
                  ? "You don't have any past bookings"
                  : "You haven't made any bookings yet"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;