import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaHome,
  FaChartBar,
  FaCalendarAlt,
  FaSignOutAlt,
  FaMoneyBillWave,
  FaUserCheck,
  FaBuilding,
  FaChartLine,
  FaUserPlus,
} from "react-icons/fa";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Properties from "./Properties";
import Users from "./Users";
import Bookings from "./Bookings";
import Reports from "../../components/Admin/Dashboard/Reports";
import { logout } from "../../services/User/UserApi";
import { useContext } from "react";
import { UserDataContext } from "../../context/UserContex";
import { getDashboardStats } from "../../services/Admin/AdminApi";
import TrendChart from "../../components/Admin/Dashboard/TrendChart";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.split("/")[2] || "overview"
  );
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingTrendsData, setBookingTrendsData] = useState([]);
  const [revenueAnalysisData, setRevenueAnalysisData] = useState([]);

  const { userData, setUserData, isAuthenticated, setIsAuthenticated } =
    useContext(UserDataContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setBookingTrendsData(data.bookingTrends || []);
        setRevenueAnalysisData(data.revenueAnalysis || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const defaultStats = [
    {
      title: "Total Properties",
      value: stats?.propertyCount || "0",
      change: stats?.propertyGrowth || "+0%",
      icon: FaBuilding,
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: stats?.userCount || "0",
      change: stats?.userGrowth || "+0%",
      icon: FaUserCheck,
      color: "bg-green-500",
    },
    {
      title: "Total Bookings",
      value: stats?.bookingCount || "0",
      change: stats?.bookingGrowth || "+0%",
      icon: FaCalendarAlt,
      color: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: `₹${stats?.totalRevenue || "0"}`,
      change: stats?.revenueGrowth || "+0%",
      icon: FaMoneyBillWave,
      color: "bg-yellow-500",
    },
  ];

  const recentActivities = stats?.recentActivities || [
    {
      type: "Loading Activities",
      description: "Loading recent activities...",
      time: "",
      icon: FaCalendarAlt,
      color: "bg-gray-100 text-gray-600",
    },
  ];

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    navigate(`/admin/${tabName === "overview" ? "" : tabName}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("favorites");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderOverview = () => (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back, {userData?.fullName || "Admin"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/admin/reports")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2"
        >
          <FaChartLine className="w-4 h-4" />
          <span>View Reports</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {defaultStats.map((stat, index) => (
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
              <span
                className={`text-sm font-medium ${
                  parseFloat(stat.change) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <TrendChart
              chartData={bookingTrendsData}
              reportType="bookings"
              height={300}
            />
          )}
        </div>

        {/* Revenue Analysis Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Analysis</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <TrendChart
              chartData={revenueAnalysisData}
              reportType="revenue"
              height={300}
              showComparison={true}
            />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Recent Activity
        </h2>
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
                {activity.type.includes("Booking") && (
                  <FaCalendarAlt className="w-5 h-5" />
                )}
                {activity.type.includes("Property") && (
                  <FaHome className="w-5 h-5" />
                )}
                {activity.type.includes("User") && (
                  <FaUserPlus className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-medium">{activity.type}</h3>
                <p className="text-gray-600">{activity.description}</p>
                <span className="text-sm text-gray-500">
                  {activity.time
                    ? new Date(activity.time).toLocaleString()
                    : ""}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

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
              { name: "Overview", icon: FaChartBar, path: "overview" },
              { name: "Properties", icon: FaHome, path: "properties" },
              { name: "Users", icon: FaUsers, path: "users" },
              { name: "Bookings", icon: FaCalendarAlt, path: "bookings" },
              { name: "Reports", icon: FaChartLine, path: "reports" },
            ].map((item) => (
              <motion.button
                key={item.path}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.path.toLowerCase()
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-50"
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
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
