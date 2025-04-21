import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaStar, FaSort, 
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { getProperties } from '../../services/Admin/AdminApi';
import AddPropertyForm from '../../components/Admin/AddPropertyForm';
import ViewPropertyModal from '../../components/Admin/ViewPropertyModal';
import EditPropertyModal from '../../components/Admin/EditPropertyModal';
import DeleteConfirmationModal from '../../components/Admin/DeleteConfirmationModal';

function Properties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewProperty, setViewProperty] = useState(null);
  const [editProperty, setEditProperty] = useState(null);
  const [deleteProperty, setDeleteProperty] = useState(null);
  const propertiesPerPage = 5;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    if (searchTerm) {
      result = result.filter(property => 
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.host?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return result;
  }, [properties, searchTerm, sortBy]);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredAndSortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredAndSortedProperties.length / propertiesPerPage);

  const handleAddProperty = (newProperty) => {
    setProperties(prev => [newProperty, ...prev]);
    setShowAddForm(false);
  };

  const handleUpdateProperty = (updatedProperty) => {
    setProperties(prev => 
      prev.map(property => 
        property._id === updatedProperty._id ? updatedProperty : property
      )
    );
    setEditProperty(null);
  };

  const handleDeleteConfirm = (deletedProperty) => {
    setProperties(prev => 
      prev.filter(property => property._id !== deletedProperty._id)
    );
    setDeleteProperty(null);
  };

  const handleView = (id) => {
    const property = properties.find(p => p._id === id);
    setViewProperty(property);
  };

  const handleEdit = (id) => {
    const property = properties.find(p => p._id === id);
    setEditProperty(property);
  };

  const handleDelete = (id) => {
    const property = properties.find(p => p._id === id);
    setDeleteProperty(property);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage and monitor all property listings</p>
        </div>
        <motion.button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Property</span>
        </motion.button>
      </div>

      {showAddForm && (
        <AddPropertyForm 
          onClose={() => setShowAddForm(false)}
          onAddProperty={handleAddProperty}
        />
      )}

      {viewProperty && (
        <ViewPropertyModal
          property={viewProperty}
          onClose={() => setViewProperty(null)}
          onEdit={() => {
            setEditProperty(viewProperty);
            setViewProperty(null);
          }}
        />
      )}

      {editProperty && (
        <EditPropertyModal
          property={editProperty}
          onClose={() => setEditProperty(null)}
          onUpdateProperty={handleUpdateProperty}
        />
      )}

      {deleteProperty && (
        <DeleteConfirmationModal
          property={deleteProperty}
          onClose={() => setDeleteProperty(null)}
          onConfirmDelete={handleDeleteConfirm}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaSort className="text-gray-400" />
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="w-full">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">Host</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Updated</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProperties.map((property) => (
                <motion.tr
                  key={property._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={property.images?.[0]?.url || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'}
                        alt={property.title}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-500">{property.location}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">₹{property.price}/night</div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 w-4 h-4 mr-1" />
                      <span className="text-sm text-gray-900">{property.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({property.reviewsCount})</span>
                    </div>
                  </td>
                  {property.userId?.role === "admin" ? (
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <div className="text-sm text-gray-500"><b>Admin</b> - {property.userId?.fullName}</div>
                    </td>
                  ) : (
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <div className="text-sm text-gray-500">{property.userId?.fullName}</div>
                    </td>
                  )}
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="text-sm text-gray-500">{property.createdAt?.slice(0, 10)}</div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        onClick={() => handleView(property._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleEdit(property._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(property._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
          <div className="flex items-center text-sm text-gray-500">
            Showing {indexOfFirstProperty + 1} to {Math.min(indexOfLastProperty, filteredAndSortedProperties.length)} of {filteredAndSortedProperties.length} properties
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <FaChevronLeft className="w-4 h-4" />
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                {page}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <FaChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Properties;