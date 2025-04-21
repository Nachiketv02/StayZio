import { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaHeart,
  FaHome,
  FaCalendarAlt,
  FaUserShield,
} from "react-icons/fa";
import { UserDataContext } from "../context/UserContex";
import { logout } from "../services/User/UserApi";
import useFavoriteStore from "../store/favoriteStore";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const dropdownRef = useRef(null);
  const { userData, setUserData, isAuthenticated, setIsAuthenticated } =
    useContext(UserDataContext);
  const { favorites } = useFavoriteStore();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isHeroSection = isHome && scrollY < window.innerHeight - 100;

  const handleLogin = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleSignUp = () => {
    navigate("/signup");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/");
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    useFavoriteStore.getState().setFavorites([]);
  };

  const handleAdminPanel = () => {
    navigate("/admin");
    setIsProfileOpen(false);
  };

  const handleProfile = () => {
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
    setIsProfileOpen(false);
  };

  const handleMyProperties = () => {
    navigate("/my-properties");
    setIsProfileOpen(false);
  };

  const handleMyBookings = () => {
    navigate("/my-bookings");
    setIsProfileOpen(false);
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isHeroSection
          ? "bg-gradient-to-b from-black/50 to-transparent py-6"
          : "bg-white shadow-md py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.05 }}>
            <Link to="/">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Stayzio
              </h1>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center justify-center flex-1 mx-10 space-x-8">
            <Link to="/destinations">
              <motion.span
                className={`text-lg font-medium cursor-pointer ${
                  isHeroSection ? "text-white" : "text-gray-700"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Destinations
              </motion.span>
            </Link>
            <Link to="/experiences">
              <motion.span
                className={`text-lg font-medium cursor-pointer ${
                  isHeroSection ? "text-white" : "text-gray-700"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Experiences
              </motion.span>
            </Link>
            <Link to="/properties">
              <motion.span
                className={`text-lg font-medium cursor-pointer ${
                  isHeroSection ? "text-white" : "text-gray-700"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Properties
              </motion.span>
            </Link>
            <Link to="/become-host">
              <motion.span
                className={`text-lg font-medium cursor-pointer ${
                  isHeroSection ? "text-white" : "text-gray-700"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Host
              </motion.span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/favorites">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`p-3 rounded-full flex items-center justify-center ${
                    isHeroSection
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-primary-50 hover:bg-primary-100"
                  }`}
                >
                  <FaHeart
                    className={`w-5 h-5 ${
                      isHeroSection
                        ? "text-white"
                        : favorites.length > 0
                        ? "text-red-500"
                        : "text-primary-600"
                    }`}
                  />
                  {favorites.length > 0 && (
                    <span
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isHeroSection
                          ? "bg-white text-primary-600"
                          : "bg-primary-600 text-white"
                      }`}
                    >
                      {favorites.length}
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all border ${
                    isHeroSection
                      ? "text-white border-blue-400 bg-blue-400/10 hover:bg-blue-400/20"
                      : "text-primary-600 border-blue-400 bg-blue-50 hover:bg-blue-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <FaUserCircle className="w-6 h-6" />
                  <span>Hi, {userData.fullName?.split(" ")[0]}</span>
                  <FaChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                      <div className="flex flex-col divide-y divide-gray-200">
                        {userData.role === "admin" && (
                          <motion.button
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={handleAdminPanel}
                            whileHover={{ scale: 1.05 }}
                          >
                            <FaUserShield className="w-4 h-4 mr-2" />
                            Admin Panel
                          </motion.button>
                        )}
                        <motion.button
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={handleProfile}
                          whileHover={{ scale: 1.05 }}
                        >
                          <FaUser className="w-4 h-4 mr-2" />
                          {userData.role === "admin"
                            ? "Admin Profile"
                            : "Profile"}
                        </motion.button>
                        {userData.role !== "admin" && (
                          <>
                            <motion.button
                              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={handleMyProperties}
                              whileHover={{ scale: 1.05 }}
                            >
                              <FaHome className="w-4 h-4 mr-2" />
                              My Properties
                            </motion.button>
                            <motion.button
                              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={handleMyBookings}
                              whileHover={{ scale: 1.05 }}
                            >
                              <FaCalendarAlt className="w-4 h-4 mr-2" />
                              Your Bookings
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          onClick={handleLogout}
                          whileHover={{ scale: 1.05 }}
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-2" />
                          Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.button
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    isHeroSection
                      ? "text-white hover:bg-white/10"
                      : "text-primary-600 border-2 border-primary-500 bg-primary-50/20 hover:bg-primary-50/40"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                >
                  Log in
                </motion.button>
                <motion.button
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    isHeroSection
                      ? "bg-white text-primary-600 hover:bg-white/90"
                      : "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:opacity-90"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignUp}
                >
                  Sign up
                </motion.button>
              </>
            )}
          </div>

          <motion.div className="md:hidden" whileTap={{ scale: 0.9 }}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <FaUserCircle
                    className={`w-6 h-6 ${
                      isHeroSection ? "text-white" : "text-primary-600"
                    }`}
                  />
                </div>
              ) : (
                <svg
                  className={`h-6 w-6 ${
                    isHeroSection ? "text-white" : "text-primary-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated && (
                <div className="flex items-center space-x-3 px-2 py-3 border border-blue-200 rounded-lg bg-blue-50 mb-4">
                  <FaUserCircle className="w-10 h-10 text-blue-400" />
                  <div>
                    <p className="font-medium text-blue-700">
                      Hi, {userData.fullName?.split(" ")[0]}
                    </p>
                    <p className="text-sm text-blue-500">{userData.email}</p>
                  </div>
                </div>
              )}
              <Link to="/destinations">
                <motion.div
                  className="block py-2 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Destinations
                </motion.div>
              </Link>
              <Link to="/experiences">
                <motion.div
                  className="block py-2 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Experiences
                </motion.div>
              </Link>
              <Link to="/properties">
                <motion.div
                  className="block py-2 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Properties
                </motion.div>
              </Link>
              <Link to="/become-host">
                <motion.div
                  className="block py-2 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Host
                </motion.div>
              </Link>
              <Link to="/favorites">
                <motion.div
                  className="flex items-center justify-between py-2 px-2 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <FaHeart
                      className={
                        favorites.length > 0 ? "text-red-500" : "text-gray-400"
                      }
                    />
                    <span>Wishlist</span>
                  </div>
                  {favorites.length > 0 && (
                    <span className="bg-primary-600 text-white text-sm px-2 py-1 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </motion.div>
              </Link>
              {isAuthenticated ? (
                <div className="pt-4 space-y-3">
                {userData.role === "admin" && (
                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 text-purple-600 border-2 border-purple-400 bg-purple-50 hover:bg-purple-100 px-6 py-3 rounded-full font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    onClick={handleAdminPanel}
                  >
                    <FaUserShield className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </motion.button>
                )}
                <motion.button
                  className="w-full flex items-center justify-center space-x-2 text-blue-600 border-2 border-blue-400 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  onClick={handleProfile}
                >
                  <FaUserCircle className="w-5 h-5" />
                  <span>{userData.role === "admin" ? "Admin Profile" : "Profile"}</span>
                </motion.button>
                {userData.role !== "admin" && (
                  <>
                    <motion.button
                      className="w-full flex items-center justify-center space-x-2 text-blue-600 border-2 border-blue-400 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      onClick={handleMyProperties}
                    >
                      <FaHome className="w-5 h-5" />
                      <span>My Properties</span>
                    </motion.button>
                    <motion.button
                      className="w-full flex items-center justify-center space-x-2 text-blue-600 border-2 border-blue-400 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      onClick={handleMyBookings}
                    >
                      <FaCalendarAlt className="w-5 h-5" />
                      <span>My Bookings</span>
                    </motion.button>
                  </>
                )}
                <motion.button
                  className="w-full flex items-center justify-center space-x-2 text-red-600 border-2 border-red-200 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-full font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
              ) : (
                <div className="pt-4 space-y-3">
                  <motion.button
                    className="w-full text-primary-600 border-2 border-primary-500 bg-primary-50/20 hover:bg-primary-50/40 px-6 py-3 rounded-full font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    onClick={handleLogin}
                  >
                    Log in
                  </motion.button>
                  <motion.button
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.02 }}
                    onClick={handleSignUp}
                  >
                    Sign up
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
