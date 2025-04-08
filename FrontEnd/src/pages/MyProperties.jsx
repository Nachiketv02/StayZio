import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
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
  FaPlus
} from 'react-icons/fa';

function MyProperties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchProperties = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProperties([
        {
          id: 1,
          title: "Luxury Beachfront Villa",
          location: "Bali, Indonesia",
          price: 3500,
          status: "active",
          rating: 4.9,
          reviews: 128,
          image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80",
          amenities: ["WiFi", "Pool", "Parking", "TV"],
          bedrooms: 4,
          bathrooms: 3,
          lastUpdated: "2024-02-15"
        },
        {
          id: 2,
          title: "Modern City Apartment",
          location: "Tokyo, Japan",
          price: 2000,
          status: "pending",
          rating: 4.8,
          reviews: 96,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
          amenities: ["WiFi", "Parking", "TV"],
          bedrooms: 2,
          bathrooms: 1,
          lastUpdated: "2024-02-14"
        },
        {
          id: 3,
          title: "Mountain View Chalet",
          location: "Swiss Alps",
          price: 4500,
          status: "inactive",
          rating: 4.7,
          reviews: 75,
          image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80",
          amenities: ["WiFi", "Parking", "TV", "Pool"],
          bedrooms: 3,
          bathrooms: 2,
          lastUpdated: "2024-02-13"
        }
      ]);
      setIsLoading(false);
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProperties(properties.filter(p => p.id !== propertyToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
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
      default:
        return null;
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <span
                      className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        property.status
                      )}`}
                    >
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
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
                        ${property.price}
                        <span className="text-sm font-normal text-gray-500">/night</span>
                      </span>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <FaEye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
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
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
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