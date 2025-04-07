import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPlane, FaStar, FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Destinations() {
  const destinations = [
    {
      id: 1,
      name: "Santorini",
      country: "Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80",
      rating: 4.9,
      reviews: 1280,
      properties: 450,
      description: "Experience the stunning white architecture and breathtaking sunsets of Santorini.",
      highlights: ["Caldera Views", "Sunset Spots", "Wine Tours"],
      activities: ["Island Hopping", "Beach Relaxation", "Cultural Tours"]
    },
    {
      id: 2,
      name: "Kyoto",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80",
      rating: 4.8,
      reviews: 1560,
      properties: 680,
      description: "Discover ancient temples and traditional Japanese culture in historic Kyoto.",
      highlights: ["Temple Tours", "Tea Ceremonies", "Cherry Blossoms"],
      activities: ["Cultural Workshops", "Garden Visits", "Food Tours"]
    },
    {
      id: 3,
      name: "Maui",
      country: "United States",
      image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&q=80",
      rating: 4.9,
      reviews: 2100,
      properties: 890,
      description: "Paradise found on Hawaii's Valley Isle with pristine beaches and lush landscapes.",
      highlights: ["Road to Hana", "Haleakala Sunrise", "Whale Watching"],
      activities: ["Surfing", "Hiking", "Snorkeling"]
    }
  ]

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-black">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"
          alt="Travel"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4"
            >
              Explore Dream Destinations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl"
            >
              Discover amazing places and create unforgettable memories
            </motion.p>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
            >
              {/* Image with overlay */}
              <div className="relative h-64 shrink-0">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">
                        {destination.name}
                      </h3>
                      <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <FaStar className="text-yellow-400 w-4 h-4 mr-1" />
                        <span className="font-semibold">{destination.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-white/90 mt-1">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                      <span>{destination.country}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Properties and reviews */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <FaPlane className="text-primary-500 w-5 h-5 mr-2" />
                    <span className="text-gray-600">
                      {destination.properties} properties
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {destination.reviews} reviews
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-5 line-clamp-3">
                  {destination.description}
                </p>

                {/* Highlights */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    Highlights
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm whitespace-nowrap"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    Popular Activities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {destination.activities.map((activity) => (
                      <span
                        key={activity}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm whitespace-nowrap"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Button - pushed to bottom */}
                <div className="mt-auto">
                  <Link to={`/properties?destination=${destination.name}`}>
                    <motion.button
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-xl font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Explore Properties
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Destinations