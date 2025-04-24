import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BecomeHost from './pages/BecomeHost'
import ListProperty from './pages/ListProperty'
import PropertyDetails from './pages/PropertyDetails'
import ComingSoon from './pages/ComingSoon'
import OTPVerification from './pages/OTPVerification'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Destinations from './pages/Destinations'
import Experiences from './pages/Experiences'
import MyProperties from './pages/MyProperties'
import Favorites from './pages/Favorites'
import ProtectedRoute from './context/ProtectedRoute';
import EditProperty from './pages/EditProperty';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/admin/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from 'react-hot-toast'

function PublicLayout() {
  const location = useLocation();
  const isComingSoonPage = location.pathname === '/coming-soon';
  
  return (
    <>
      {!isComingSoonPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/become-host" element={<BecomeHost />} />
        <Route path="/list-property" element={<ProtectedRoute><ListProperty /></ProtectedRoute>} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/my-properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/edit-property/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />
        <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/*" element={<PublicLayout />} />
        <Route path="/not-found" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App