import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaCalendarAlt, FaUsers, FaCreditCard, FaMapMarkerAlt, FaHome, FaDownload } from 'react-icons/fa'
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import toast from 'react-hot-toast'
import {useLocation, useNavigate } from 'react-router-dom'

function BookingConfirmation() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { property, bookingData } = state || {}
  const receiptRef = useRef(null)

  if (!property || !bookingData) {
    navigate('/')
    return null
  }

  const bookingDetails = [
    {
      icon: FaCalendarAlt,
      label: "Check-in",
      value: new Date(bookingData.checkIn).toLocaleDateString()
    },
    {
      icon: FaCalendarAlt,
      label: "Check-out",
      value: new Date(bookingData.checkOut).toLocaleDateString()
    },
    {
      icon: FaUsers,
      label: "Guests",
      value: `${bookingData.guests} ${bookingData.guests === 1 ? 'Guest' : 'Guests'}`
    },
    {
      icon: FaCreditCard,
      label: "Payment Method",
      value: bookingData.paymentMethod === 'credit' ? 'Credit Card' : 
             bookingData.paymentMethod === 'debit' ? 'Debit Card' : 'UPI'
    }
  ]

  const handleDownloadReceipt = async () => {
    try {
      const dataUrl = await toPng(receiptRef.current, { quality: 1.0 })
      download(dataUrl, `booking-receipt-${Date.now()}.png`)
      toast.success('Receipt downloaded successfully!')
    } catch (error) {
      console.error('Error downloading receipt:', error)
      toast.error('Failed to download receipt')
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600">
              Your reservation has been successfully confirmed.
            </p>
          </div>

          <div ref={receiptRef} className="bg-white p-6 rounded-xl">
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="flex items-center">
                <img
                  src={property.images?.[0]?.url}
                  alt={property.title}
                  className="w-24 h-24 rounded-lg object-cover mr-6"
                />
                <div>
                  <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                    <span>{property.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {bookingDetails.map((detail, index) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-4 bg-gray-50 rounded-xl"
                >
                  <detail.icon className="w-5 h-5 text-primary-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">{detail.label}</p>
                    <p className="font-medium">{detail.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>₹{property.price} × 1 night</span>
                  <span>₹{property.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹{Math.round(property.price * 0.1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{Math.round(property.price * 0.18)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 font-semibold">
                  <div className="flex justify-between">
                    <span>Total Paid</span>
                    <span>₹{property.price + Math.round(property.price * 0.1) + Math.round(property.price * 0.18)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <motion.button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaHome className="mr-2" />
              Return to Home
            </motion.button>
            <motion.button
              onClick={handleDownloadReceipt}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaDownload className="mr-2" />
              Download Receipt
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingConfirmation