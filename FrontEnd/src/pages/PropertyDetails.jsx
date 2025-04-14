import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBed,
  FaBath,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaTv,
  FaUtensils,
  FaDog,
  FaCalendarAlt,
  FaStar,
  FaUser,
  FaMapMarkerAlt,
  FaSnowflake,
  FaTrash,
} from "react-icons/fa";
import { getPropertyById, getPropertyReviews, deleteReview } from "../services/User/UserApi";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContex";

const amenityIcons = {
  WiFi: FaWifi,
  Parking: FaParking,
  "Swimming Pool": FaSwimmingPool,
  TV: FaTv,
  Kitchen: FaUtensils,
  "Pet Friendly": FaDog,
  "Air Conditioning": FaSnowflake,
};

function PropertyDetails() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { userData } = useContext(UserDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyData = await getPropertyById(id);
        setProperty(propertyData);
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getPropertyReviews(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [id]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(review => review._id !== reviewId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const amenitiesWithIcons =
    property.amenities?.map((amenity) => ({
      name: amenity,
      icon: amenityIcons[amenity] || FaWifi,
    })) || [];

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            className="relative aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={
                property.images?.[selectedImage]?.url ||
                "https://via.placeholder.com/800x600"
              }
              alt={property.title}
              className="absolute w-full h-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {property.images?.map((image, index) => (
              <motion.div
                key={index}
                className={`relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden cursor-pointer ${
                  selectedImage === index ? "ring-4 ring-primary-500" : ""
                }`}
                onClick={() => setSelectedImage(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={image.url || "https://via.placeholder.com/400x300"}
                  alt={`${property.title} ${index + 1}`}
                  className="absolute w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <motion.h1
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {property.title}
              </motion.h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{property.rating}</span>
                  <span className="ml-1">({property.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <motion.div
              className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-center">
                <FaBed className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <p className="text-gray-600">{property.bedrooms} Bedrooms</p>
              </div>
              <div className="text-center">
                <FaBath className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <p className="text-gray-600">{property.bathrooms} Bathrooms</p>
              </div>
              <div className="text-center">
                <FaUser className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <p className="text-gray-600">
                  Up to {property.bedrooms * 2} guests
                </p>
              </div>
            </motion.div>

            <motion.div
              className="prose max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-4">About this place</h2>
              <p className="text-gray-600">{property.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesWithIcons.map(({ name, icon: Icon }) => (
                  <div
                    key={name}
                    className="flex items-center p-4 bg-white rounded-xl shadow-sm"
                  >
                    <Icon className="w-5 h-5 text-primary-500 mr-3" />
                    <span className="text-gray-600">{name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white p-6 rounded-xl shadow-sm relative"
                    >
                      <div className="flex items-center mb-4">
                        <div>
                          <h3 className="font-medium">
                            {review.userId.fullName}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{formatDate(review.createdAt)}</span>
                            <span className="mx-2">•</span>
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 mr-1" />
                              <span>{review.rating}</span>
                            </div>
                          </div>
                        </div>
                        {userData?._id === review.userId._id && (
                          <motion.button
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDeleteConfirm(review._id)}
                          >
                            <FaTrash className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{review.comment}</p>

                      <div className="flex items-center text-sm text-primary-600">
                        <FaCalendarAlt className="mr-2" />
                        <span>
                          Verified stay - (
                          {formatDate(review.bookingId.checkIn)} -{" "}
                          {formatDate(review.bookingId.checkOut)})
                        </span>
                      </div>

                      {/* Delete Confirmation Modal */}
                      <AnimatePresence>
                        {deleteConfirm === review._id && (
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
                              className="bg-white rounded-xl p-6 max-w-sm mx-4"
                            >
                              <h3 className="text-xl font-semibold mb-4">Delete Review</h3>
                              <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this review? This action cannot be undone.
                              </p>
                              <div className="flex justify-end space-x-4">
                                <motion.button
                                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setDeleteConfirm(null)}
                                >
                                  Cancel
                                </motion.button>
                                <motion.button
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDeleteReview(review._id)}
                                >
                                  Delete
                                </motion.button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="md:col-span-1">
            <motion.div
              className="sticky top-24 bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Price */}
              <div className="mb-6">
                <span className="text-2xl font-bold">₹{property.price}</span>
                <span className="text-gray-600"> / night</span>
              </div>

              <motion.button
                onClick={() =>
                  navigate(`/booking/${property._id}`, { state: { property } })
                }
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-lg font-medium shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reserve Now
              </motion.button>

              {/* Host Info */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                    <FaUser className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Hosted by {property.userId?.fullName || "Host"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Joined in{" "}
                      {new Date(property.createdAt).toLocaleDateString(
                        "default",
                        { month: "long", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-2" />
                    <span>4.8 Rating</span>
                  </div>
                  <p>98% response rate</p>
                  <p>Responds within an hour</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;