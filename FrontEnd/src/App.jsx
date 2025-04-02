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
import Dashboard from './pages/admin/Dashboard'
import ComingSoon from './pages/ComingSoon'

function PublicLayout() {
  const location = useLocation()
  const isComingSoonPage = location.pathname === '/coming-soon'
  
  return (
    <>
      {!isComingSoonPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/become-host" element={<BecomeHost />} />
        <Route path="/list-property" element={<ListProperty />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </Router>
  )
}

export default App