import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaCalendarAlt, FaUsers, FaCreditCard,
  FaCheckCircle, FaTimesCircle, FaMapMarkerAlt
} from 'react-icons/fa';
// import { updateBookingStatus } from '../../services/Admin/BookingService';

function BookingDetails({ booking, onBack }) {
  if (!booking) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateBookingStatus(booking._id, newStatus);
      // Refresh booking data or show success message
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <FaArrowLeft className="w-5 h-5" />
            </motion.button>
            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          </div>
          <div className={`px-4 py-2 rounded-full border ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Property Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <img
                    src={booking.propertyId?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                    alt={booking.propertyId?.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">{booking.propertyId?.title}</h4>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                      {booking.propertyId?.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Booking Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                    Check-in
                  </div>
                  <p className="text-gray-900 font-medium mt-1">{formatDate(booking.checkIn)}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                    Check-out
                  </div>
                  <p className="text-gray-900 font-medium mt-1">{formatDate(booking.checkOut)}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600">
                    <FaUsers className="w-4 h-4 mr-2" />
                    Guests
                  </div>
                  <p className="text-gray-900 font-medium mt-1">{booking.guests} guests</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600">
                    <FaCreditCard className="w-4 h-4 mr-2" />
                    Payment Method
                  </div>
                  <p className="text-gray-900 font-medium mt-1">{booking.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Guest Details & Actions */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600">Name</label>
                  <p className="text-gray-900 font-medium">{booking.userId?.fullName}</p>
                </div>
                <div>
                  <label className="text-gray-600">Email</label>
                  <p className="text-gray-900 font-medium">{booking.userId?.email}</p>
                </div>
                <div>
                  <label className="text-gray-600">Phone</label>
                  <p className="text-gray-900 font-medium">{booking.userId?.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600">Total Amount</label>
                  <p className="text-2xl font-bold text-gray-900">₹{booking.totalAmount}</p>
                </div>
                <div>
                  <label className="text-gray-600">Payment Status</label>
                  <p className="text-gray-900 font-medium">Paid</p>
                </div>
              </div>
            </div>

            {booking.status === 'pending' && (
              <div className="flex flex-col space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusUpdate('confirmed')}
                  className="w-full py-2 bg-green-600 text-white rounded-lg flex items-center justify-center"
                >
                  <FaCheckCircle className="w-4 h-4 mr-2" />
                  Confirm Booking
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusUpdate('cancelled')}
                  className="w-full py-2 bg-red-600 text-white rounded-lg flex items-center justify-center"
                >
                  <FaTimesCircle className="w-4 h-4 mr-2" />
                  Cancel Booking
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default BookingDetails;