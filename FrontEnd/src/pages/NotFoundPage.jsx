import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function NotFoundPage() {
  const navigate = useNavigate();

  // Set document title
  useEffect(() => {
    document.title = 'Stayzio - Page Not Found';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header matching your dashboard */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-primary-600">Stayzio Admin</h2>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <FaExclamationTriangle className="text-red-500 text-4xl" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center gap-2"
            >
              <FaArrowLeft />
              <span>Go Back</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <FaHome />
              <span>Return to Dashboard</span>
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Footer matching your theme */}
      <footer className="bg-white py-4 px-6 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Stayzio Admin. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default NotFoundPage;