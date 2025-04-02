import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBed, FaBath, FaWifi, FaParking, FaSwimmingPool, FaTv, FaUtensils, FaDog, FaCalendarAlt, FaStar, FaUser, FaMapMarkerAlt } from 'react-icons/fa'

function PropertyDetails() {
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)

  // This would typically come from an API call using the id
  const property = {
    id: 1,
    title: "Luxury Beachfront Villa",
    description: "Experience luxury living in this stunning beachfront villa. Wake up to panoramic ocean views and enjoy direct beach access. This modern villa features high-end finishes, an infinity pool, and spacious living areas perfect for families or groups.",
    location: "Bali, Indonesia",
    price: 3500,
    images: [
      "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewsCount: 128,
    beds: 4,
    baths: 3,
    maxGuests: 8,
    amenities: [
      { name: "WiFi", icon: FaWifi },
      { name: "Parking", icon: FaParking },
      { name: "Swimming Pool", icon: FaSwimmingPool },
      { name: "Smart TV", icon: FaTv },
      { name: "Kitchen", icon: FaUtensils },
      { name: "Pet Friendly", icon: FaDog }
    ],
    host: {
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      rating: 4.8,
      responseRate: 98,
      responseTime: "within an hour",
      joined: "January 2020"
    },
    reviews: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80",
        rating: 5,
        date: "October 2023",
        comment: "Amazing property with stunning views. The host was very accommodating and the amenities were top-notch."
      },
      {
        id: 2,
        user: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        rating: 4.5,
        date: "September 2023",
        comment: "Beautiful villa with great attention to detail. The beach access was perfect and the pool was amazing."
      }
    ]
  }

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
              src={property.images[selectedImage]}
              alt={property.title}
              className="absolute w-full h-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {property.images.map((image, index) => (
              <motion.div
                key={index}
                className={`relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden cursor-pointer ${
                  selectedImage === index ? 'ring-4 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedImage(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  className="absolute w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Header */}
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
                  <span className="ml-1">({property.reviews.length} reviews)</span>
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
                <p className="text-gray-600">{property.beds} Bedrooms</p>
              </div>
              <div className="text-center">
                <FaBath className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <p className="text-gray-600">{property.baths} Bathrooms</p>
              </div>
              <div className="text-center">
                <FaUser className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <p className="text-gray-600">Up to {property.maxGuests} guests</p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="prose max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-4">About this place</h2>
              <p className="text-gray-600">{property.description}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map(({ name, icon: Icon }) => (
                  <div key={name} className="flex items-center p-4 bg-white rounded-xl shadow-sm">
                    <Icon className="w-5 h-5 text-primary-500 mr-3" />
                    <span className="text-gray-600">{name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-6">
                {property.reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center mb-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{review.user}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{review.date}</span>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
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

              {/* Booking Form */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in / Check-out
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Add dates"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>1 guest</option>
                      <option>2 guests</option>
                      <option>3 guests</option>
                      <option>4 guests</option>
                      <option>5 guests</option>
                      <option>6 guests</option>
                      <option>7 guests</option>
                      <option>8 guests</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-lg font-medium shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reserve
                </motion.button>
              </form>

              {/* Host Info */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center mb-4">
                  <img
                    src={property.host.image}
                    alt={property.host.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium">Hosted by {property.host.name}</h3>
                    <p className="text-sm text-gray-500">Joined in {property.host.joined}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-2" />
                    <span>{property.host.rating} Rating</span>
                  </div>
                  <p>{property.host.responseRate}% response rate</p>
                  <p>Responds {property.host.responseTime}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails