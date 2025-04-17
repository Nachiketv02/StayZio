import { motion } from 'framer-motion'
import { FaMoneyBillWave, FaCalendarAlt, FaUsers, FaCheckCircle , FaStar } from 'react-icons/fa'
import {useNavigate} from 'react-router-dom';

function BecomeHost() {

  const navigate = useNavigate();
  
  const benefits = [
    {
      icon: FaMoneyBillWave,
      title: "Earn Extra Income",
      description: "Turn your space into a source of income. Hosts on Stayzio earn an average of $800 per month."
    },
    {
      icon: FaCalendarAlt,
      title: "Flexible Schedule",
      description: "You're in control. Host whenever it suits your schedule and lifestyle."
    },
    {
      icon: FaUsers,
      title: "Meet Global Travelers",
      description: "Connect with guests from around the world and create lasting relationships."
    }
  ]

  const steps = [
    {
      number: "01",
      title: "List Your Space",
      description: "Share your space's best features and photos to attract guests."
    },
    {
      number: "02",
      title: "Welcome Guests",
      description: "Set your own schedule, prices, and requirements for guests."
    },
    {
      number: "03",
      title: "Start Earning",
      description: "Get paid securely and easily through our platform."
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="relative h-[80vh] bg-gradient-to-r from-primary-600 to-primary-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Share Your Space,
              <br />
              Earn Extra Income
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of hosts who are earning by sharing their spaces on Stayzio. 
              It's easy to get started and we're here to help every step of the way.
            </p>
            <motion.button
              className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate('/list-property');
              }}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Why Host on Stayzio?</h2>
            <p className="text-xl text-gray-600">Join our community of hosts and start earning from your space</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="inline-block p-4 bg-primary-50 rounded-2xl mb-6">
                  <benefit.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to start hosting</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative bg-white p-8 rounded-2xl shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <span className="absolute -top-6 left-8 text-6xl font-bold text-primary-100">
                  {step.number}
                </span>
                <h3 className="text-2xl font-semibold mb-4 relative">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Host Protection & Support</h2>
              <div className="space-y-6">
                {[
                  "Up to $1M liability insurance",
                  "24/7 customer support",
                  "Property damage protection",
                  "Secure payments",
                  "Verified guest profiles"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <FaCheckCircle className="text-primary-600 w-6 h-6 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="bg-primary-50 p-8 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <FaStar className="text-yellow-400 w-8 h-8" />
                <span className="text-2xl font-semibold ml-2">4.8/5</span>
              </div>
              <p className="text-lg text-gray-700 italic mb-6">
                "Hosting on Stayzio has been an amazing experience. The platform is easy to use, 
                and the support team is always there when you need them."
              </p>
              <div>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-gray-600">Superhost since 2023</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Hosting Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our community of successful hosts and start earning from your space today. 
              We'll guide you through every step of the process.
            </p>
            <motion.button
              className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold text-lg shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                  navigate('/list-property');
              }}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BecomeHost