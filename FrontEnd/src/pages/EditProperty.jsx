import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRupeeSign,
  FaHome,
  FaWifi,
  FaSwimmingPool,
  FaParking,
  FaTv,
  FaSnowflake,
  FaUtensils,
  FaWater,
  FaDumbbell,
  FaDog,
  FaUmbrellaBeach,
  FaBuilding,
  FaWarehouse,
  FaHotel,
  FaCity,
  FaFlag,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";
import { UserDataContext } from "../context/UserContex";
import { updateProperty, getPropertyById } from "../services/User/UserApi";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    location: "",
    country: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    existingImages: [], // Store existing images from API
    newImages: [], // Store newly uploaded files
  });

  const { isAuthenticated } = useContext(UserDataContext);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to edit properties");
      navigate("/login");
      return;
    }
    fetchPropertyDetails();
  }, [id, isAuthenticated]);

  const fetchPropertyDetails = async () => {
    try {
      const property = await getPropertyById(id);
      setFormData({
        title: property.title,
        description: property.description,
        type: property.type,
        location: property.location,
        country: property.country,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenities: property.amenities,
        existingImages: property.images || [],
        newImages: [],
      });
    } catch (error) {
      toast.error(error.message);
      navigate("/my-properties");
    } finally {
      setIsLoading(false);
    }
  };

  const propertyTypes = [
    { value: "Apartment", icon: FaBuilding },
    { value: "House", icon: FaHome },
    { value: "Villa", icon: FaHotel },
    { value: "Condo", icon: FaCity },
    { value: "Townhouse", icon: FaWarehouse },
    { value: "Studio", icon: FaHome },
    { value: "Other", icon: FaHome },
  ];

  const amenitiesList = [
    { value: "WiFi", icon: FaWifi },
    { value: "Air Conditioning", icon: FaSnowflake },
    { value: "Parking", icon: FaParking },
    { value: "Swimming Pool", icon: FaSwimmingPool },
    { value: "Gym", icon: FaDumbbell },
    { value: "Kitchen", icon: FaUtensils },
    { value: "Beach Access", icon: FaUmbrellaBeach },
    { value: "TV", icon: FaTv },
    { value: "Ocean View", icon: FaWater },
    { value: "Pet Friendly", icon: FaDog },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePropertyTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
    }));
    if (errors.type) {
      setErrors((prev) => ({
        ...prev,
        type: "",
      }));
    }
  };

  const handleAmenitiesChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error(
          `Invalid file type: ${file.name}. Only JPG, JPEG, PNG allowed.`
        );
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Max 5MB allowed.`);
        return false;
      }

      return true;
    });

    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...validFiles],
    }));
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.type) newErrors.type = "Property type is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.price || isNaN(formData.price))
      newErrors.price = "Valid price is required";
    if (!formData.bedrooms || isNaN(formData.bedrooms))
      newErrors.bedrooms = "Number of bedrooms is required";
    if (!formData.bathrooms || isNaN(formData.bathrooms))
      newErrors.bathrooms = "Number of bathrooms is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      document.getElementsByName(firstError)[0]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setIsSubmitting(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "existingImages" && key !== "newImages" && key !== "amenities" && !Array.isArray(formData[key])) {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      formData.amenities.forEach(amenity => {
        formDataToSend.append('amenities[]', amenity);
      });
  
      formData.existingImages.forEach((image) => {
        formDataToSend.append('existingImages[]', image.url);
      });
  
      formData.newImages.forEach((image) => {
        formDataToSend.append('newImages', image);
      });

      const response = await updateProperty(id, formDataToSend);
      navigate("/my-properties");
      if (response && response.success) {
        setShowSuccess(true);
        toast.success("Property updated successfully!");
      } else {
        throw new Error(response?.message || "Failed to update property");
      }
    } catch (error) {
      setShowError(true);
      toast.error(error.message || "Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Edit Property
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Property Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full rounded-xl border ${
                  errors.title ? "border-red-300" : "border-gray-300"
                } px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200`}
                placeholder="Luxury Beachfront Villa"
              />
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.title}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`block w-full rounded-xl border ${
                  errors.description ? "border-red-300" : "border-gray-300"
                } px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200`}
                placeholder="Describe your property..."
              />
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.description}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Property Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {propertyTypes.map(({ value, icon: Icon }) => (
                  <motion.button
                    key={value}
                    type="button"
                    onClick={() => handlePropertyTypeSelect(value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.type === value
                        ? "border-primary-500 bg-primary-50 text-primary-600"
                        : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        formData.type === value
                          ? "text-primary-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="mt-2 text-sm font-medium">{value}</span>
                  </motion.button>
                ))}
              </div>
              {errors.type && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.type}
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border ${
                      errors.location ? "border-red-300" : "border-gray-300"
                    } pl-12 pr-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200`}
                    placeholder="Surat, Gujarat"
                  />
                </div>
                {errors.location && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.location}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Country
                </label>
                <div className="relative">
                  <FaFlag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border ${
                      errors.country ? "border-red-300" : "border-gray-300"
                    } pl-12 pr-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200`}
                    placeholder="India"
                  />
                </div>
                {errors.country && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.country}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Price per Night
                </label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border ${
                      errors.price ? "border-red-300" : "border-gray-300"
                    } pl-12 pr-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200`}
                    placeholder="1500"
                    min="1"
                  />
                </div>
                {errors.price && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.price}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <div className="relative">
                  <FaBed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border ${
                      errors.bedrooms ? "border-red-300" : "border-gray-300"
                    } pl-12 pr-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200`}
                    placeholder="2"
                    min="0"
                  />
                </div>
                {errors.bedrooms && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.bedrooms}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <div className="relative">
                  <FaBath className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border ${
                      errors.bathrooms ? "border-red-300" : "border-gray-300"
                    } pl-12 pr-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200`}
                    placeholder="2"
                    min="0"
                  />
                </div>
                {errors.bathrooms && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.bathrooms}
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Available Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenitiesList.map(({ value, icon: Icon }) => (
                  <motion.div
                    key={value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <input
                      type="checkbox"
                      id={value}
                      checked={formData.amenities.includes(value)}
                      onChange={() => handleAmenitiesChange(value)}
                      className="peer absolute opacity-0"
                    />
                    <label
                      htmlFor={value}
                      className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 cursor-pointer transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:bg-gray-50"
                    >
                      <Icon className="w-5 h-5 text-gray-500 peer-checked:text-primary-500" />
                      <span className="ml-3 text-sm font-medium">{value}</span>
                    </label>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Property Photos
              </label>
              <motion.div
                className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="images"
                />
                <label htmlFor="images" className="cursor-pointer block">
                  <FaCamera className="mx-auto h-16 w-16 text-gray-400" />
                  <motion.div
                    className="mt-4 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="px-4 py-2 bg-primary-500 text-white rounded-lg">
                      Choose Photos
                    </span>
                  </motion.div>
                  <p className="mt-2 text-sm text-gray-500">
                    or drag and drop your photos here
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Up to 10 photos (Max 5MB each)
                  </p>
                </label>
              </motion.div>

              {formData.existingImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {formData.existingImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-lg group"
                    >
                      <img
                        src={image.url} // Use direct URL from API
                        alt={`Property ${index + 1}`}
                        className="object-cover w-full h-full rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.newImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {formData.newImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-lg group"
                    >
                      <img
                        src={URL.createObjectURL(image)} // Create URL for new files
                        alt={`New upload ${index + 1}`}
                        className="object-cover w-full h-full rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <motion.button
                type="button"
                onClick={() => navigate("/my-properties")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className={`px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </span>
                ) : (
                  "Update Property"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSuccess && (
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
              className="bg-white rounded-xl p-6 max-w-md mx-4 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Property Updated Successfully!
              </h3>
              <p className="text-gray-600">
                Your property has been updated and the changes are now live.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showError && (
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
              className="bg-white rounded-xl p-6 max-w-md mx-4 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTimesCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Update Failed
              </h3>
              <p className="text-gray-600">
                There was an error updating your property. Please try again.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EditProperty;
