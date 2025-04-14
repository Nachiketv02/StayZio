import { useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBed,
  FaBath,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaHeart,
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
import { getFavorites, removeFavorite } from "../services/User/UserApi";
import { UserDataContext } from "../context/UserContex";

function Favorites() {
  const {
    favorites,
    removeFavorite: removeFromStore,
    setFavorites,
  } = useFavoriteStore();
  const { isAuthenticated } = useContext(UserDataContext);

  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated) {
        try {
          const favorites = await getFavorites();
          setFavorites(favorites);
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      }
    };
    loadFavorites();
  }, [isAuthenticated, setFavorites]);

  const handleRemoveFavorite = async (property) => {
    try {
      await removeFavorite(property.propertyId._id);
      removeFromStore(property._id);
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove favorite");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Your Favorite Properties
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your saved properties all in one place
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                No favorites yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start exploring and save properties you love!
              </p>
              <Link to="/properties">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium"
                >
                  Explore Properties
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {favorites.map((property) => (
                <motion.div
                  key={property._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="relative aspect-w-16 aspect-h-9">
                    <img
                      src={property.propertyId?.images?.[0]?.url}
                      alt={property.propertyId?.title}
                      className="absolute w-full h-full object-cover"
                    />
                    <motion.button
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveFavorite(property)}
                    >
                      <FaHeart className="w-5 h-5 text-red-500" />
                    </motion.button>
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                      ${property.propertyId?.price}/night
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {property.propertyId?.title}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-gray-700">
                          {property.propertyId?.rating}
                        </span>
                        <span className="ml-1 text-gray-500">
                          ({property.propertyId?.reviewsCount})
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {property.propertyId?.location},{" "}
                      {property.propertyId?.country}
                    </p>
                    <div className="flex items-center gap-4 mb-6 text-gray-600">
                      <div className="flex items-center">
                        <FaBed className="mr-2" />
                        <span>{property.propertyId?.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center">
                        <FaBath className="mr-2" />
                        <span>{property.propertyId?.bathrooms} baths</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      {property.propertyId?.amenities.includes("WiFi") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaWifi className="inline mr-1" /> WiFi
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("Parking") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaParking className="inline mr-1" /> Parking
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("Pool") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaSwimmingPool className="inline mr-1" /> Pool
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("Air Conditioning") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaSnowflake className="inline mr-1" /> Air
                          Conditioning
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("TV") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaTv className="inline mr-1" /> TV
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("Beach Access") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaUmbrellaBeach className="inline mr-1" /> Beach
                          Access
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("Pet Friendly") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaDog className="inline mr-1" /> Pet Friendly
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("Ocean View") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaWater className="inline mr-1" /> Ocean View
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("Gym") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaDumbbell className="inline mr-1" /> Gym
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("Kitchen") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaUtensils className="inline mr-1" /> Kitchen
                        </div>
                      )}
                      {property.propertyId?.amenities.includes("Swimming Pool") && (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          <FaSwimmingPool className="inline mr-1" /> Swimming
                          Pool
                        </div>
                      )}
                    </div>
                    <Link to={`/properties/${property.propertyId?._id}`}>
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
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
