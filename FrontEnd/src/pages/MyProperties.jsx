import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaSort,
  FaEdit,
  FaTrash,
  FaEye,
  FaStar,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaWifi,
  FaSwimmingPool,
  FaParking,
  FaTv,
  FaPlus,
  FaSnowflake,
  FaUtensils,
  FaWater,
  FaDumbbell,
  FaDog,
  FaUmbrellaBeach,
  FaSpinner,
} from 'react-icons/fa';
import { getMyProperties , deleteProperty } from '../services/User/UserApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function MyProperties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const fetchedProperties = await getMyProperties();
      setProperties(fetchedProperties);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch properties');
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    return property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           property.location.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'oldest':
        return new Date(a.lastUpdated) - new Date(b.lastUpdated);
      default: // newest
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
  });

  const handleDelete = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeletingProperty(true);
    try {
      await deleteProperty(propertyToDelete._id);
      setProperties(properties.filter(p => p._id !== propertyToDelete._id));
      toast.success('Property deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete property');
    } finally {
      setIsDeletingProperty(false);
    }
  };

  const handleView = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const AmenityIcon = ({ amenity }) => {
    switch (amenity) {
      case 'WiFi':
        return <FaWifi className="w-4 h-4" />;
      case 'Pool':
        return <FaSwimmingPool className="w-4 h-4" />;
      case 'Parking':
        return <FaParking className="w-4 h-4" />;
      case 'TV':
        return <FaTv className="w-4 h-4" />;
      case 'Air Conditioning':
        return <FaSnowflake className="w-4 h-4" />;
      case 'Gym':
        return <FaDumbbell className="w-4 h-4" />;
      case 'Dog':
        return <FaDog className="w-4 h-4" />;
      case 'Beach Access':
        return <FaUmbrellaBeach className="w-4 h-4" />;
      case 'Kitchen':
        return <FaUtensils className="w-4 h-4" />;
      case 'Ocean View':
        return <FaWater className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProperties}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600">Manage and monitor your property listings</p>
          </div>
          <Link to="/list-property">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center space-x-2 shadow-lg hover:bg-primary-700 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              <span>Add Property</span>
            </motion.button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <FaSort className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Start by adding your first property listing</p>
            <Link
              to="/list-property"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProperties.map((property) => (
                <motion.div
                  key={property._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={property.images?.[0]?.url}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}, {property.country}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <FaBed className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600 mr-3">{property.bedrooms}</span>
                        <FaBath className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600">{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{property.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({property.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      {property.amenities.map((amenity) => (
                        <motion.div
                          key={amenity}
                          whileHover={{ scale: 1.1 }}
                          className="text-gray-500"
                          title={amenity}
                        >
                          <AmenityIcon amenity={amenity} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">
                        ₹{property.price.toLocaleString('en-IN')}
                        <span className="text-sm font-normal text-gray-500">/night</span>
                      </span>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleView(property._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <FaEye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/edit-property/${property._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <FaEdit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(property)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <FaTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md mx-4"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Delete Property
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{propertyToDelete?.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeletingProperty}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDelete}
                    disabled={isDeletingProperty}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                  >
                    {isDeletingProperty ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
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

export default MyProperties;