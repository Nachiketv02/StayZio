import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaCreditCard, FaLock, FaUser, FaEnvelope, FaPhone, FaSpinner } from 'react-icons/fa';
import { getPropertyById } from '../services/User/UserApi';
import { UserDataContext } from '../context/UserContex';

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    paymentMethod: '',
  });
  const [errors, setErrors] = useState({});
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const { userData } = useContext(UserDataContext);

  // Mock user data - replace with actual user context/data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210"
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyData = await getPropertyById(id);
        setProperty(propertyData);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Calculate number of nights whenever dates change
  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      setNumberOfNights(nights > 0 ? nights : 0);
    } else {
      setNumberOfNights(0);
    }
  }, [bookingData.checkIn, bookingData.checkOut]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const calculatePrices = () => {
    if (!property || numberOfNights <= 0) return { basePrice: 0, serviceFee: 0, taxes: 0, total: 0 };

    const basePrice = property.price * numberOfNights;
    const serviceFee = Math.round(basePrice * 0.1);
    const taxes = Math.round(basePrice * 0.18);
    const total = basePrice + serviceFee + taxes;

    return { basePrice, serviceFee, taxes, total };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Additional validation for check-out date
    if (name === 'checkIn' && bookingData.checkOut) {
      if (new Date(value) >= new Date(bookingData.checkOut)) {
        setBookingData(prev => ({
          ...prev,
          checkOut: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date(getTodayDate());
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);

    if (!bookingData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    } else if (checkIn < today) {
      newErrors.checkIn = 'Check-in date cannot be in the past';
    }

    if (!bookingData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    } else if (checkOut <= checkIn) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
    }

    if (!bookingData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      const prices = calculatePrices();
      navigate(`/booking-confirmation/${id}`, { 
        state: { 
          property,
          bookingData,
          numberOfNights,
          prices
        }
      });
    } else {
      setErrors(newErrors);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <FaSpinner className="w-8 h-8 text-primary-600" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800">Loading Property Details</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch the information...</p>
        </motion.div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Property Not Found</h2>
          <p className="text-gray-500 mt-2">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const prices = calculatePrices();

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="flex items-center mb-8">
            <img
              src={property.images?.[0]?.url}
              alt={property.title}
              className="w-24 h-24 rounded-lg object-cover mr-6"
            />
            <div>
              <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
              <p className="text-gray-600">{property.location}</p>
              <p className="text-lg font-semibold mt-2">₹{property.price.toLocaleString('en-IN')} / night</p>
            </div>
          </div>

          {/* User Details Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{userData.fullName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{userData.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleChange}
                    min={getTodayDate()}
                    className={`pl-10 w-full px-4 py-3 rounded-xl border ${
                      errors.checkIn ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                </div>
                {errors.checkIn && (
                  <p className="mt-2 text-sm text-red-600">{errors.checkIn}</p>
                )}
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleChange}
                    min={bookingData.checkIn || getTodayDate()}
                    className={`pl-10 w-full px-4 py-3 rounded-xl border ${
                      errors.checkOut ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                </div>
                {errors.checkOut && (
                  <p className="mt-2 text-sm text-red-600">{errors.checkOut}</p>
                )}
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <div className="relative">
                  <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="relative">
                  <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="paymentMethod"
                    value={bookingData.paymentMethod}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 rounded-xl border ${
                      errors.paymentMethod ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="credit">Credit Card</option>
                    <option value="debit">Debit Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                {errors.paymentMethod && (
                  <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Price Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>₹{property.price.toLocaleString('en-IN')} × {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}</span>
                  <span>₹{prices.basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹{prices.serviceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{prices.taxes.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 font-semibold">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>₹{prices.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-6">
              <FaLock className="w-4 h-4 mr-2" />
              <span>Your payment information is encrypted and secure</span>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-medium shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Confirm Booking
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Booking;