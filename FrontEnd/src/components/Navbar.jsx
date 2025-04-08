import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart } from 'react-icons/fa'
import useFavoriteStore from '../store/favoriteStore'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const { favorites } = useFavoriteStore()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHeroSection = isHome && scrollY < window.innerHeight - 100

  const handleLogin = () => {
    navigate('/login')
    setIsMenuOpen(false)
  }

  const handleSignUp = () => {
    navigate('/signup')
    setIsMenuOpen(false)
  }

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isHeroSection 
          ? 'bg-gradient-to-b from-black/50 to-transparent py-6' 
          : 'bg-white shadow-md py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand Logo - Left */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Stayzio
              </h1>
            </Link>
          </motion.div>
          
          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-10 space-x-8">
            <Link to="/destinations">
              <motion.span
                className={`text-lg font-medium cursor-pointer ${
                  isHeroSection ? 'text-white' : 'text-gray-700'
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
                  isHeroSection ? 'text-white' : 'text-gray-700'
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
                  isHeroSection ? 'text-white' : 'text-gray-700'
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
                  isHeroSection ? 'text-white' : 'text-gray-700'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Host
              </motion.span>
            </Link>
          </div>

          {/* Auth Buttons - Right */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/favorites">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeart className={`w-6 h-6 ${isHeroSection ? 'text-white' : 'text-primary-600'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </motion.div>
            </Link>
            <motion.button
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                isHeroSection 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-primary-600 border-2 border-primary-500 bg-primary-50/20 hover:bg-primary-50/40'
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
                  ? 'bg-white text-primary-600 hover:bg-white/90' 
                  : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:opacity-90'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignUp}
            >
              Sign up
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.div 
            className="md:hidden"
            whileTap={{ scale: 0.9 }}
          >
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className={`h-6 w-6 ${isHeroSection ? 'text-white' : 'text-primary-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              <Link to="/destinations">
                <motion.div
                  className="block py-2 text-lg font-medium text-gray-700"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Destinations
                </motion.div>
              </Link>
              <Link to="/experiences">
                <motion.div
                  className="block py-2 text-lg font-medium text-gray-700"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Experiences
                </motion.div>
              </Link>
              <Link to="/properties">
                <motion.div
                  className="block py-2 text-lg font-medium text-gray-700"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Properties
                </motion.div>
              </Link>
              <Link to="/become-host">
                <motion.div
                  className="block py-2 text-lg font-medium text-gray-700"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Host
                </motion.div>
              </Link>
              <Link to="/favorites">
                <motion.div
                  className="block py-2 text-lg font-medium text-gray-700"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites ({favorites.length})
                </motion.div>
              </Link>
              <div className="pt-4 space-y-3">
                <motion.button
                  className="w-full text-primary-600 border-2 border-primary-500 bg-primary-50/20 hover:bg-primary-50/40 px-6 py-3 rounded-full font-medium"
                  whileHover={{ scale: 1.02 }}
                  onClick={handleLogin}
                >
                  Log in
                </motion.button>
                <motion.button
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-full font-medium"
                  whileHover={{ scale: 1.02 }}
                  onClick={handleSignUp}
                >
                  Sign up
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar