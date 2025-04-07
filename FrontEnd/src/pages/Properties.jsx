import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaSearch, FaBed, FaBath, FaWifi, FaParking, FaSwimmingPool, FaHeart } from 'react-icons/fa'
import useFavoriteStore from '../store/favoriteStore'
import toast from 'react-hot-toast'


function Properties() {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: 'all',
    propertyType: 'all',
    amenities: []
  })

  const { favorites, addFavorite, removeFavorite } = useFavoriteStore()

  const properties = [
    {
      id: 1,
      title: "Luxury Beachfront Villa",
      location: "Bali, Indonesia",
      price: 3500,
      image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80",
      rating: 4.9,
      reviews: 128,
      beds: 4,
      baths: 3,
      amenities: ["Pool", "WiFi", "Parking"]
    },
    {
      id: 2,
      title: "Modern City Apartment",
      location: "Tokyo, Japan",
      price: 2000,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
      rating: 4.8,
      reviews: 96,
      beds: 2,
      baths: 2,
      amenities: ["WiFi", "Parking"]
    },
    {
      id: 3,
      title: "Mountain View Chalet",
      location: "Swiss Alps",
      price: 4500,
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80",
      rating: 4.9,
      reviews: 84,
      beds: 3,
      baths: 2,
      amenities: ["Pool", "WiFi", "Parking"]
    }
  ]

  const handleFavoriteClick = (property) => {
    const isFavorite = favorites.some(fav => fav.id === property.id)
    if (isFavorite) {
      removeFavorite(property.id)
      toast.success('Removed from favorites')
    } else {
      addFavorite(property)
      toast.success('Added to favorites')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Search and Filters */}
      <div className="bg-white shadow-lg py-6 sticky top-[74px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              >
                <option value="all">All Prices</option>
                <option value="0-100">$0 - $100</option>
                <option value="101-300">$101 - $300</option>
                <option value="301+">$301+</option>
              </select>
              <select
                className="px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((property) => (
              <motion.div
                key={property.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="relative aspect-w-16 aspect-h-9">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="absolute w-full h-full object-cover"
                  />
                  <motion.button
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleFavoriteClick(property)}
                  >
                    <FaHeart className="w-5 h-5 text-red-500" />
                  </motion.button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <Link to={`/properties/${property.id}`}>
                    <motion.button
                      className="w-full bg-primary-600 text-white py-2 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <motion.div
              key={property.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative aspect-w-16 aspect-h-9">
                <img
                  src={property.image}
                  alt={property.title}
                  className="absolute w-full h-full object-cover"
                />
                <motion.button
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleFavoriteClick(property)}
                >
                  <FaHeart 
                    className={`w-5 h-5 ${
                      favorites.some(fav => fav.id === property.id)
                        ? 'text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </motion.button>
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                  ${property.price}/night
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-700">{property.rating}</span>
                    <span className="ml-1 text-gray-500">({property.reviews})</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <div className="flex items-center gap-4 mb-6 text-gray-600">
                  <div className="flex items-center">
                    <FaBed className="mr-2" />
                    <span>{property.beds} beds</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-2" />
                    <span>{property.baths} baths</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  {property.amenities.includes("WiFi") && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                      <FaWifi className="inline mr-1" /> WiFi
                    </div>
                  )}
                  {property.amenities.includes("Parking") && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                      <FaParking className="inline mr-1" /> Parking
                    </div>
                  )}
                  {property.amenities.includes("Pool") && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                      <FaSwimmingPool className="inline mr-1" /> Pool
                    </div>
                  )}
                </div>
                <Link to={`/properties/${property.id}`}>
                  <motion.button
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-lg font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Properties