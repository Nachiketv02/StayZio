import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSave, FaUser, FaEnvelope, FaPhone, FaVenusMars, FaLock, FaUserShield, FaCheckCircle } from 'react-icons/fa';
import { updateUser } from '../../../services/Admin/AdminApi';

function UserForm({ user, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'male',
    password: '',
    confirmPassword: '',
    role: 'user',
    isVerified: false,
    isHost: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'male',
        password: '',
        confirmPassword: '',
        role: user.role || 'user',
        isVerified: user.isVerified || false,
        isHost: user.isHost || false
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    const phoneRegex = /^\d{10,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[+\s()-]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const userData = { ...formData };
      if (!userData.password) {
        delete userData.password;
        delete userData.confirmPassword;
      } else {
        delete userData.confirmPassword;
      }
      
      await updateUser(user._id, userData);
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error.response?.data?.message || 'An error occurred while updating the user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (error) => `
    mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg 
    transition-colors duration-200 ease-in-out
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
    }
    focus:ring-2 focus:ring-opacity-50 focus:outline-none
  `;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 text-white hover:bg-blue-600 rounded-lg"
            >
              <FaArrowLeft className="w-5 h-5" />
            </motion.button>
            <h2 className="text-2xl font-bold text-white">
              {user ? 'Edit User' : 'Add New User'}
            </h2>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="mx-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
          >
            <p className="text-red-700">{submitError}</p>
          </motion.div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className={labelClasses}>
                <div className="flex items-center space-x-2">
                  <FaUser className="text-gray-400" />
                  <span>Full Name <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClasses(errors.fullName)}
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClasses}>
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-gray-400" />
                  <span>Email Address <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses(errors.email)}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={labelClasses}>
                <div className="flex items-center space-x-2">
                  <FaPhone className="text-gray-400" />
                  <span>Phone Number <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClasses(errors.phone)}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className={labelClasses}>
                <div className="flex items-center space-x-2">
                  <FaVenusMars className="text-gray-400" />
                  <span>Gender <span className="text-red-500">*</span></span>
                </div>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClasses()}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className={labelClasses}>
                <div className="flex items-center space-x-2">
                  <FaLock className="text-gray-400" />
                  <span>
                    Password
                    {user && <span className="text-xs text-gray-500 ml-1">(Leave blank to keep current)</span>}
                  </span>
                </div>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClasses(errors.password)}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClasses}>
                <div className="flex items-center space-x-2">
                  <FaLock className="text-gray-400" />
                  <span>Confirm Password</span>
                </div>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClasses(errors.confirmPassword)}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Role & Status */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Role & Status</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="role" className={labelClasses}>
                <div className="flex items-center space-x-2">
                  <FaUserShield className="text-gray-400" />
                  <span>User Role</span>
                </div>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputClasses()}
              >
                <option value="user">Regular User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="flex flex-col space-y-4">
              <label className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`
                  w-14 h-7 bg-gray-200 rounded-full peer 
                  ${formData.isVerified ? 'bg-green-600' : 'bg-gray-200'}
                  transition-colors duration-200
                `}>
                  <div className={`
                    absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200
                    ${formData.isVerified ? 'translate-x-7' : 'translate-x-0'}
                  `}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Verified User</span>
              </label>

              <label className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="isHost"
                  checked={formData.isHost}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`
                  w-14 h-7 bg-gray-200 rounded-full peer
                  ${formData.isHost ? 'bg-blue-600' : 'bg-gray-200'}
                  transition-colors duration-200
                `}>
                  <div className={`
                    absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200
                    ${formData.isHost ? 'translate-x-7' : 'translate-x-0'}
                  `}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Host Status</span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 
              transition-colors duration-200 flex items-center space-x-2"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg
              hover:from-blue-700 hover:to-blue-800 transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FaSave className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default UserForm;