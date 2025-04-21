import { motion } from 'framer-motion';
import { EditIcon, TrashIcon } from '../../Icon/Icons';

function UserDetails({ user, onEdit, onDelete }) {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              <EditIcon className="w-4 h-4" />
              <span>Edit</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Basic Info */}
          <div className="flex-1">
            <div className="mb-6 flex items-center">
              <div className="h-16 w-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-gray-900">{user.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 text-gray-900 capitalize">{user.gender}</p>
              </div>
            </div>

            <h4 className="text-lg font-medium text-gray-900 mb-4">Account Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Host Status</label>
                <p className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                    user.isHost 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isHost ? 'Host' : 'Not a Host'}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                <p className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                    user.isVerified 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Joined</label>
                <p className="mt-1 text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="flex-1">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Verification Details</h4>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                  <p className="mt-1 text-gray-900">{user.verificationCode || 'No active code'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code Expiry</label>
                  <p className="mt-1 text-gray-900">{formatDate(user.verificationCodeExpiry)}</p>
                </div>
              </div>
            </div>

            <h4 className="text-lg font-medium text-gray-900 mb-4">Password Reset</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reset Token Status</label>
                  <p className="mt-1 text-gray-900">
                    {user.resetPasswordToken ? 'Token active' : 'No active reset token'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Token Expiry</label>
                  <p className="mt-1 text-gray-900">{formatDate(user.resetPasswordTokenExpiry)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Security Actions</h4>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Reset Password
                </button>
                <button className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  user.isVerified 
                    ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' 
                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }`}>
                  {user.isVerified ? 'Unverify Account' : 'Verify Account'}
                </button>
                <button className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  user.isHost 
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}>
                  {user.isHost ? 'Remove Host Status' : 'Make Host'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserDetails;