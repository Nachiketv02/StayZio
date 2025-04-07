import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaFlag
} from "react-icons/fa";

function ListProperty() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    images: [],
  });

  const [errors, setErrors] = useState({});

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
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (!formData.type) newErrors.type = "Property type is required";
    } else if (step === 2) {
      if (!formData.location.trim())
        newErrors.location = "Location is required";
      if (!formData.price || isNaN(formData.price))
        newErrors.price = "Valid price is required";
      if (!formData.bedrooms || isNaN(formData.bedrooms))
        newErrors.bedrooms = "Number of bedrooms is required";
      if (!formData.bathrooms || isNaN(formData.bathrooms))
        newErrors.bathrooms = "Number of bathrooms is required";
    }

    return newErrors;
  };

  const handleNextStep = () => {
    const newErrors = validateStep(currentStep);
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setErrors(newErrors);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateStep(currentStep);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
      // Here you would typically send the data to your backend
    } else {
      setErrors(newErrors);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Details" },
    { number: 3, title: "Amenities" },
    { number: 4, title: "Photos" },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between items-center relative">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center relative z-10"
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.number
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.number}
                  </motion.div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-primary-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
              {/* Progress Line */}
              <div className="absolute top-5 left-0 h-0.5 bg-gray-200 w-full -z-10">
                <motion.div
                  className="h-full bg-primary-600"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
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
                        errors.description
                          ? "border-red-300"
                          : "border-gray-300"
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
                          <span className="mt-2 text-sm font-medium">
                            {value}
                          </span>
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
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
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
                            errors.location
                              ? "border-red-300"
                              : "border-gray-300"
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
                            errors.country
                              ? "border-red-300"
                              : "border-gray-300"
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
                            errors.bedrooms
                              ? "border-red-300"
                              : "border-gray-300"
                          } pl-12 pr-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200`}
                          placeholder="2"
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
                            errors.bathrooms
                              ? "border-red-300"
                              : "border-gray-300"
                          } pl-12 pr-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200`}
                          placeholder="2"
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
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
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
                            <span className="ml-3 text-sm font-medium">
                              {value}
                            </span>
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
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
                    {formData.images.length > 0 && (
                      <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {formData.images.map((image, index) => (
                          <motion.div
                            key={index}
                            className="relative aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Property ${index + 1}`}
                              className="object-cover w-full h-full rounded-xl"
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={handlePrevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Previous
                </motion.button>
              )}
              <motion.button
                type={currentStep === steps.length ? "submit" : "button"}
                onClick={
                  currentStep === steps.length ? undefined : handleNextStep
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 ml-auto"
              >
                {currentStep === steps.length ? "List Property" : "Next"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default ListProperty;
