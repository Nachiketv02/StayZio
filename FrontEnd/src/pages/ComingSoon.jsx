import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Mail, Timer } from 'lucide-react';

function ComingSoon() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-700 flex flex-col items-center justify-center p-4 relative">
      <motion.button
        onClick={handleBack}
        className="absolute top-6 left-6 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Go Back</span>
      </motion.button>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 text-center relative overflow-hidden mx-4" 
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Phone Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <Smartphone className="w-16 h-16 text-white mx-auto" />
        </motion.div>

        {/* Heading and Description */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Coming Soon!</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-lg mx-auto">
            We're working hard to bring you an amazing mobile experience. Stay tuned!
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Timer,
              title: "Launch Date",
              text: "Summer 2025",
            },
            {
              icon: Smartphone,
              title: "Platforms",
              text: "iOS & Android",
            },
            {
              icon: Mail,
              title: "Get Notified",
              text: "Join waitlist",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6 flex flex-col items-center"
            >
              <item.icon className="w-8 h-8 text-white mb-3" />
              <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">{item.title}</h3>
              <p className="text-sm md:text-base text-white/80">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 md:px-6 md:py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm md:text-base"
            />
            <motion.button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-primary-600 px-4 py-1 md:px-5 md:py-2 rounded-full font-medium text-sm md:text-base"
              whileHover={{ 
                backgroundColor: "#f0f0f0",
                transition: { duration: 0.1 }
              }}
              whileTap={{ 
                scale: 0.98,
                backgroundColor: "#e0e0e0"
              }}
              style={{ 
                marginLeft: '8px',
                transformOrigin: 'center'
              }}
            >
              Notify Me
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ComingSoon;