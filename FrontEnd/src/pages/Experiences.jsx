import { motion } from 'framer-motion'
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaHeart } from 'react-icons/fa'

function Experiences() {
  const experiences = [
    {
      id: 1,
      title: "Traditional Tea Ceremony",
      location: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1545579133-99bb5ab189bd?auto=format&fit=crop&q=80",
      rating: 4.9,
      reviews: 128,
      duration: "2 hours",
      groupSize: "2-6 people",
      price: 75,
      host: {
        name: "Sakura Tanaka",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
      },
      description: "Learn the art of traditional Japanese tea ceremony in an authentic setting.",
      highlights: ["Tea Preparation", "Cultural Insights", "Traditional Sweets"],
      includes: ["Tea Materials", "Traditional Sweets", "Photo Session"]
    },
    {
      id: 2,
      title: "Tuscan Cooking Class",
      location: "Florence, Italy",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80",
      rating: 4.8,
      reviews: 256,
      duration: "4 hours",
      groupSize: "4-8 people",
      price: 120,
      host: {
        name: "Marco Rossi",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
      },
      description: "Master the art of Italian cooking with fresh, local ingredients.",
      highlights: ["Pasta Making", "Wine Pairing", "Local Ingredients"],
      includes: ["Ingredients", "Wine Tasting", "Recipe Book"]
    },
    {
      id: 3,
      title: "Desert Safari Adventure",
      location: "Dubai, UAE",
      image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&q=80",
      rating: 4.9,
      reviews: 312,
      duration: "6 hours",
      groupSize: "4-12 people",
      price: 150,
      host: {
        name: "Ahmed Hassan",
        image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80"
      },
      description: "Experience the thrill of desert adventures and traditional Bedouin culture.",
      highlights: ["Dune Bashing", "Camel Riding", "BBQ Dinner"],
      includes: ["Transport", "Activities", "Dinner"]
    }
  ]

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-black">
        <img
          src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80"
          alt="Experiences"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4"
            >
              Unforgettable Experiences
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl"
            >
              Discover unique activities with local experts
            </motion.p>
          </div>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
            >
              <div className="relative h-64">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                  >
                    <FaHeart className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="font-semibold text-primary-600">
                        ${experience.price}
                      </span>
                      <span className="text-gray-600"> / person</span>
                    </div>
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <FaStar className="text-yellow-400 w-4 h-4 mr-1" />
                      <span className="font-semibold">{experience.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {experience.title}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                    <span>{experience.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaClock className="w-4 h-4 mr-1" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="w-4 h-4 mr-1" />
                      <span>{experience.groupSize}</span>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>{experience.reviews} reviews</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={experience.host.image}
                      alt={experience.host.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Hosted by</p>
                      <p className="font-medium">{experience.host.name}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {experience.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">
                        Experience Highlights
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">
                        What's Included
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.includes.map((item) => (
                          <span
                            key={item}
                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  className="w-full mt-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-xl font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Experience
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Experiences