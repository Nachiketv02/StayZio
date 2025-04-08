import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContex";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaSpinner } from "react-icons/fa";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated, userData, setUserData } = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        navigate("/login");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <FaSpinner className="w-8 h-8 text-primary-600" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800">Loading</h2>
          <p className="text-gray-500 mt-2">Please wait while we verify your session...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated && showMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaLock className="w-8 h-8 text-primary-600" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to access this page. Redirecting you to the login page...
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-1 bg-primary-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;