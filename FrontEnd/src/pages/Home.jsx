import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { 
  FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaHeart, 
  FaStar, FaGlobe, FaShieldAlt, FaUserCheck, 
  FaHandshake, FaCrown, FaAward, FaArrowRight, FaPlane,
  FaQuoteLeft, FaApple, FaGooglePlay, FaCheck
} from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

function Home() {
  const [searchParams, setSearchParams] = useState({
    location: "",
    dates: "",
    guests: "",
  });

  const navigate = useNavigate();

  const handleAppStoreClick = () => {
    navigate('/coming-soon');
  };

  const handlePlayStoreClick = () => {
    navigate('/coming-soon');
  };

  const heroBackgrounds = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80",
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: FaUserCheck,
      title: "Verified Hosts",
      description: "All our hosts go through a strict verification process",
    },
    {
      icon: FaHandshake,
      title: "Secure Bookings",
      description: "Your payments and personal data are always protected",
    },
    {
      icon: FaCrown,
      title: "Premium Service",
      description: "24/7 concierge service for all your needs",
    },
  ];

  const stats = [
    {
      number: "250K+",
      label: "Happy Guests",
      subtext: "Creating memories worldwide",
      icon: FaHeart,
    },
    {
      number: "180+",
      label: "Countries",
      subtext: "Global presence",
      icon: FaGlobe,
    },
    {
      number: "24/7",
      label: "Expert Support",
      subtext: "Always here for you",
      icon: FaShieldAlt,
    },
    {
      number: "50K+",
      label: "Premium Properties",
      subtext: "Handpicked for you",
      icon: FaAward,
    },
  ];

  const countries = [
    {
      name: "Japan",
      description: "Experience the perfect blend of tradition and modernity",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80",
      properties: 1250,
      rating: 4.9,
      popularCities: ["Tokyo", "Kyoto", "Osaka"],
      highlights: ["Cherry Blossoms", "Ancient Temples", "Modern Cities"],
      averagePrice: "$200/night",
    },
    {
      name: "Italy",
      description: "Discover the art of dolce vita and timeless beauty",
      image:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80",
      properties: 2100,
      rating: 4.8,
      popularCities: ["Rome", "Florence", "Venice"],
      highlights: ["Historic Sites", "Cuisine", "Art Galleries"],
      averagePrice: "$180/night",
    },
    {
      name: "Thailand",
      description: "Embrace tropical paradise and cultural wonders",
      image:
        "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80",
      properties: 1800,
      rating: 4.7,
      popularCities: ["Bangkok", "Phuket", "Chiang Mai"],
      highlights: ["Beaches", "Temples", "Street Food"],
      averagePrice: "$120/night",
    },
    {
      name: "France",
      description: "Indulge in romance, culture, and gastronomy",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80",
      properties: 2300,
      rating: 4.8,
      popularCities: ["Paris", "Nice", "Lyon"],
      highlights: ["Architecture", "Wine Regions", "Fashion"],
      averagePrice: "$220/night",
    },
    {
      name: "Greece",
      description: "Step into ancient history and Mediterranean charm",
      image:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80",
      properties: 1600,
      rating: 4.7,
      popularCities: ["Athens", "Santorini", "Mykonos"],
      highlights: ["Islands", "Ancient Ruins", "Local Cuisine"],
      averagePrice: "$160/night",
    },
    {
      name: "Spain",
      description: "Feel the passion of vibrant culture and sunny shores",
      image:
        "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80",
      properties: 1900,
      rating: 4.8,
      popularCities: ["Barcelona", "Madrid", "Seville"],
      highlights: ["Beaches", "Architecture", "Nightlife"],
      averagePrice: "$170/night",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Emma Thompson",
      location: "London, UK",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      text: "Stayzio made our honeymoon unforgettable. The villa we booked in Bali exceeded all expectations!",
      rating: 5,
      date: "February 2024",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
      text: "As a frequent business traveler, I appreciate the consistency and quality of properties on Stayzio.",
      rating: 5,
      date: "January 2024",
    },
    {
      id: 3,
      name: "Sofia Rodriguez",
      location: "Barcelona, Spain",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      text: "Found the perfect apartment in Paris through Stayzio. The booking process was smooth and hassle-free.",
      rating: 5,
      date: "March 2024",
    },
  ];

  const appFeatures = [
    "Real-time property availability",
    "Instant booking confirmation",
    "24/7 customer support",
    "Virtual property tours",
    "Secure payment system",
    "Local experience recommendations",
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroBackgrounds[currentBg]})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[2px]"></div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Experience Luxury
                <span className="block text-primary-400">
                  Like Never Before
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Welcome to Stayzio, where extraordinary stays meet unparalleled
                service. Discover handpicked properties that redefine luxury
                living, from beachfront villas to urban penthouses.
              </p>
              <div className="flex flex-wrap gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center space-x-2"
                  >
                    <feature.icon className="text-primary-400 w-5 h-5" />
                    <span className="text-white/80">{feature.title}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Find Your Perfect Stay
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Where would you like to go?"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      value={searchParams.location}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="When are you planning to stay?"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      value={searchParams.dates}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          dates: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Number of guests"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      value={searchParams.guests}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          guests: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Link to="/properties">
                    <motion.button
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-medium text-lg shadow-lg mt-5"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaSearch className="inline-block mr-2" />
                      Search Properties
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-500">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Global Impact
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join our growing community of travelers and hosts, creating
              unforgettable experiences around the world
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform transition-all duration-300 hover:bg-white/15"
              >
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </h3>
                <p className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </p>
                <p className="text-white/80 text-sm">
                  {stat.subtext}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore by country Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Explore by Country</h2>
            <p className="text-xl text-gray-600">
              Discover amazing destinations around the world
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country, index) => (
              <motion.div
                key={country.name}
                className="group relative bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col h-full" // Added flex and h-full here
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredCountry(index)}
                onHoverEnd={() => setHoveredCountry(null)}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-72 flex-shrink-0">
                  {" "}
                  {/* Added flex-shrink-0 */}
                  <img
                    src={country.image}
                    alt={country.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {country.name}
                        </h3>
                        <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <FaStar className="text-yellow-400 w-4 h-4 mr-1" />
                          <span className="font-semibold">
                            {country.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm">
                        {country.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  {" "}
                  {/* Added flex classes */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaPlane className="text-primary-500 w-5 h-5 mr-2" />
                      <span className="text-gray-600">
                        {country.properties} properties
                      </span>
                    </div>
                    <span className="text-primary-600 font-semibold">
                      {country.averagePrice}
                    </span>
                  </div>
                  <div className="space-y-4 flex-grow">
                    {" "}
                    {/* Added flex-grow */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">
                        Popular Cities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {country.popularCities.map((city) => (
                          <span
                            key={city}
                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">
                        Highlights
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {country.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    className="mt-6 w-full bg-primary-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Explore {country.name}</span>
                    <FaArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-gradient-to-b from-gray-50 to-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Testimonials Section */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-4xl font-bold mb-4">What Our Guests Say</h2>
                <p className="text-xl text-gray-600">
                  Real experiences from real travelers
                </p>
              </motion.div>

              <div className="space-y-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {testimonial.location}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <FaStar
                                key={i}
                                className="w-4 h-4 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="relative">
                          <FaQuoteLeft className="absolute -top-2 -left-2 w-6 h-6 text-primary-200 opacity-40" />
                          <p className="text-gray-600 pl-6">
                            {testimonial.text}
                          </p>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">
                          {testimonial.date}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* App Download Section */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <h2 className="text-3xl font-bold mb-6">Get the Stayzio App</h2>
                <p className="text-lg text-white/90 mb-8">
                  Book your perfect stay anytime, anywhere with our mobile app
                </p>

                <div className="space-y-4 mb-8">
                  {appFeatures.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="bg-white/20 rounded-full p-1">
                        <FaCheck className="w-4 h-4" />
                      </div>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAppStoreClick}
                  >
                    <FaApple className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-lg font-semibold">App Store</div>
                    </div>
                  </motion.button>

                  <motion.button
                    className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlayStoreClick}
                  >
                    <FaGooglePlay className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="text-lg font-semibold">Google Play</div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
