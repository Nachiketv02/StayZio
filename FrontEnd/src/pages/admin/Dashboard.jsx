import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaHome, FaChartBar, FaCalendarAlt, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Properties from './Properties'
import Users from './Users'
import { logout } from '../../services/User/UserApi'
import { useContext } from 'react'
import { UserDataContext } from '../../context/UserContex'

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.pathname.split('/')[2] || 'overview')

  const { userData, setUserData, isAuthenticated, setIsAuthenticated } =useContext(UserDataContext);

  const stats = [
    {
      title: "Total Properties",
      value: "1,234",
      change: "+12%",
      icon: FaHome,
      color: "bg-blue-500"
    },
    {
      title: "Active Users",
      value: "5,678",
      change: "+8%",
      icon: FaUsers,
      color: "bg-green-500"
    },
    {
      title: "Total Bookings",
      value: "892",
      change: "+15%",
      icon: FaCalendarAlt,
      color: "bg-purple-500"
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+20%",
      icon: FaChartBar,
      color: "bg-yellow-500"
    }
  ]

  const recentActivities = [
    {
      type: "New Property",
      description: "Luxury Villa in Bali was added",
      time: "2 hours ago",
      icon: FaHome,
      color: "bg-blue-100 text-blue-600"
    },
    {
      type: "New Booking",
      description: "Mountain Retreat booked for 5 nights",
      time: "4 hours ago",
      icon: FaCalendarAlt,
      color: "bg-green-100 text-green-600"
    },
    {
      type: "User Registration",
      description: "New host registered: Sarah Johnson",
      time: "6 hours ago",
      icon: FaUsers,
      color: "bg-purple-100 text-purple-600"
    }
  ]

  const handleTabClick = (tabName) => {
    setActiveTab(tabName)
    navigate(`/admin/${tabName === 'overview' ? '' : tabName}`)
  }

  const renderOverview = () => (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, Admin</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-medium">{stat.change}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-6">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`${activity.color} p-3 rounded-lg`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-medium">{activity.type}</h3>
                <p className="text-gray-600">{activity.description}</p>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary-600">Stayzio Admin</h2>
        </div>
        <div className="px-4">
          <div className="space-y-2">
            {[
              { name: 'Overview', icon: FaChartBar, path: 'overview' },
              { name: 'Properties', icon: FaHome, path: 'properties' },
              { name: 'Users', icon: FaUsers, path: 'users' },
              { name: 'Bookings', icon: FaCalendarAlt, path: 'bookings' },
              { name: 'Notifications', icon: FaBell, path: 'notifications' },
              { name: 'Settings', icon: FaCog, path: 'settings' }
            ].map((item) => (
              <motion.button
                key={item.path}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.path.toLowerCase()
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleTabClick(item.path.toLowerCase())}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </motion.button>
            ))}
          </div>
          <div className="absolute bottom-8 left-4 right-4">
            <motion.button
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="ml-64">
        <Routes>
          <Route path="/" element={renderOverview()} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/users" element={<Users />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard