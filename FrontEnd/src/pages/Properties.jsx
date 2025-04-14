import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaBed,
  FaBath,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaHeart,
  FaSpinner,
  FaSnowflake,
  FaTv,
  FaUtensils,
  FaWater,
  FaDumbbell,
  FaDog,
  FaUmbrellaBeach,
} from "react-icons/fa";
import useFavoriteStore from "../store/favoriteStore";
import toast from "react-hot-toast";
import {
  getAllProperties,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/User/UserApi";
import { UserDataContext } from "../context/UserContex";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    priceRange: "all",
    propertyType: "all",
    amenities: [],
  });

  const {
    favorites,
    addFavorite: addToStore,
    removeFavorite: removeFromStore,
    setFavorites,
  } = useFavoriteStore();
  const { isAuthenticated } = useContext(UserDataContext);

  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated) {
        try {
          const favs = await getFavorites();
          setFavorites(favs);
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      }
    };
    loadFavorites();
  }, [isAuthenticated, setFavorites]);

  const handleFavoriteClick = async (property) => {
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      const isFavorite = favorites.some((fav) => fav._id === property._id);
      if (isFavorite) {
        await removeFavorite(property._id);
        removeFromStore(property._id);
        toast.success("Removed from favorites");
      } else {
        await addFavorite(property._id);
        addToStore(property);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update favorites"
      );
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllProperties();
      setProperties(response);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    if (
      filters.location &&
      !property.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.propertyType !== "all" &&
      property.type !== filters.propertyType
    ) {
      return false;
    }
    const price = property.price;
    switch (filters.priceRange) {
      case "1000-3000":
        if (price < 1000 || price > 3000) return false;
        break;
      case "3000-6000":
        if (price < 3000 || price > 6000) return false;
        break;
      case "6000-10000":
        if (price < 6000 || price > 10000) return false;
        break;
      case "10000+":
        if (price < 10000) return false;
        break;
      default:
        break;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-white shadow-lg py-6 sticky top-[73px] z-30">
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
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select
                className="w-full md:w-auto px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                value={filters.priceRange}
                onChange={(e) =>
                  setFilters({ ...filters, priceRange: e.target.value })
                }
              >
                <option value="all">All Prices</option>
                <option value="1000-3000">₹1,000 - ₹3,000</option>
                <option value="3000-6000">₹3,000 - ₹6,000</option>
                <option value="6000-10000">₹6,000 - ₹10,000</option>
                <option value="10000+">₹10,000+</option>
              </select>
              <select
                className="w-full md:w-auto px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                value={filters.propertyType}
                onChange={(e) =>
                  setFilters({ ...filters, propertyType: e.target.value })
                }
              >
                <option value="all">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Studio">Studio</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <FaSpinner className="w-8 h-8 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading properties...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchProperties}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Try Again
              </button>
            </motion.div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-600">
                No properties found matching your criteria.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    location: "",
                    priceRange: "all",
                    propertyType: "all",
                    amenities: [],
                  })
                }
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <motion.div
                  key={property._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={property.images?.[0]?.url}
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
                          favorites.some((fav) => fav._id === property._id)
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </motion.button>
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                      ₹{property.price.toLocaleString("en-IN")}/night
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center shrink-0">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-gray-700">
                          {property.rating}
                        </span>
                        <span className="ml-1 text-gray-500">
                          ({property.reviewsCount})
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-1">
                      {property.location}, {property.country}
                    </p>
                    <div className="flex items-center gap-4 mb-4 text-gray-600">
                      <div className="flex items-center">
                        <FaBed className="mr-2" />
                        <span>{property.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center">
                        <FaBath className="mr-2" />
                        <span>{property.bathrooms} baths</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      {property.amenities?.includes("WiFi") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaWifi className="inline mr-1" /> WiFi
                        </div>
                      )}
                      {property.amenities?.includes("Parking") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaParking className="inline mr-1" /> Parking
                        </div>
                      )}
                      {property.amenities?.includes("Pool") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaSwimmingPool className="inline mr-1" /> Pool
                        </div>
                      )}
                      {property.amenities?.includes("Air Conditioning") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaSnowflake className="inline mr-1" /> Air
                          Conditioning
                        </div>
                      )}
                      {property.amenities?.includes("TV") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaTv className="inline mr-1" /> TV
                        </div>
                      )}
                      {property.amenities?.includes("Beach Access") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaUmbrellaBeach className="inline mr-1" /> Beach
                          Access
                        </div>
                      )}
                      {property.amenities?.includes("Pet Friendly") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaDog className="inline mr-1" /> Pet Friendly
                        </div>
                      )}
                      {property.amenities?.includes("Ocean View") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaWater className="inline mr-1" /> Ocean View
                        </div>
                      )}
                      {property.amenities?.includes("Gym") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaDumbbell className="inline mr-1" /> Gym
                        </div>
                      )}
                      {property.amenities?.includes("Kitchen") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaUtensils className="inline mr-1" /> Kitchen
                        </div>
                      )}
                      {property.amenities?.includes("Swimming Pool") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaSwimmingPool className="inline mr-1" /> Swimming
                          Pool
                        </div>
                      )}
                    </div>
                    <div className="mt-auto">
                      <Link to={`/properties/${property._id}`}>
                        <motion.button
                          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-lg font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          View Details
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Properties;
