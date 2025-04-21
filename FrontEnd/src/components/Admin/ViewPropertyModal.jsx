import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaStar, FaMapMarkerAlt, FaBed, FaBath, 
  FaRupeeSign, FaEdit, FaCalendarAlt 
} from 'react-icons/fa';

function ViewPropertyModal({ property, onClose, onEdit }) {
  if (!property) return null;

  const amenityIcons = {
    "WiFi": "fa-wifi",
    "Air Conditioning": "fa-snowflake",
    "Parking": "fa-parking",
    "Swimming Pool": "fa-swimming-pool",
    "Gym": "fa-dumbbell",
    "Kitchen": "fa-utensils",
    "Beach Access": "fa-umbrella-beach",
    "TV": "fa-tv",
    "Ocean View": "fa-water",
    "Pet Friendly": "fa-dog"
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="relative">
            {/* Header with actions */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEdit}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full"
                >
                  <FaEdit className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 bg-gray-100 text-gray-600 rounded-full"
                >
                  <FaTimes className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Image gallery */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {property.images && property.images.length > 0 ? (
                  <>
                    <div className="md:col-span-1">
                      <img 
                        src={property.images[0]?.url || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'} 
                        alt={property.title} 
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="md:col-span-1 grid grid-cols-2 gap-4">
                      {property.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image.url || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'} 
                            alt={`${property.title} ${index + 2}`}
                            className="w-full h-28 object-cover rounded-lg shadow-sm"
                          />
                          {index === 3 && property.images.length > 5 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                              <span className="text-white font-semibold">+{property.images.length - 5} more</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {[...Array(Math.max(0, 4 - (property.images.length - 1)))].map((_, index) => (
                        <div key={`empty-${index}`} className="bg-gray-100 rounded-lg h-28"></div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2 bg-gray-100 h-64 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
              
              {/* Property details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column - Key details */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">About this property</h3>
                    <p className="text-gray-700">{property.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-2" />
                      <span className="text-gray-700">{property.location}, {property.country || 'India'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBed className="text-gray-500 mr-2" />
                      <span className="text-gray-700">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center">
                      <FaBath className="text-gray-500 mr-2" />
                      <span className="text-gray-700">{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center">
                      <FaRupeeSign className="text-gray-500 mr-2" />
                      <span className="text-gray-700">₹{property.price}/night</span>
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities && property.amenities.length > 0 ? (
                        property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <i className={`fas ${amenityIcons[amenity] || 'fa-check'} text-gray-500 mr-2`}></i>
                            <span className="text-gray-700">{amenity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-3">No amenities listed</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right column - Stats and info */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Rating</h3>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 w-6 h-6 mr-1" />
                      <span className="text-2xl font-bold">{property.rating || 'N/A'}</span>
                      <span className="text-gray-600 ml-2">({property.reviewsCount || 0} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Property Info</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{property.type || 'N/A'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Host:</span>
                        <span className="font-medium">{property.userId?.fullName || 'Unknown'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Listed:</span>
                        <span className="font-medium">{formatDate(property.createdAt)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{formatDate(property.updatedAt)}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"
                    >
                      <FaCalendarAlt className="mr-2" />
                      View Bookings
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ViewPropertyModal;