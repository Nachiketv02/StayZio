const bookingModel = require('../../model/user/booking.model');
const propertyListingModel = require('../../model/user/propertyListing.model');
const userModel = require('../../model/user/user.model');

module.exports.getDashboardStats = async (req, res) => {
  try {
    const [propertyCount, userCount, bookingCount, totalRevenue, recentBookings, recentProperties, recentUsers] = await Promise.all([
      propertyListingModel.countDocuments(),
      userModel.countDocuments(),
      bookingModel.countDocuments(),
      bookingModel.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      bookingModel.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('propertyId')
        .populate('userId'),
      propertyListingModel.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('userId'),
      userModel.find()
        .sort({ createdAt: -1 })
        .limit(3)
    ]);

    const currentDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(currentDate.getMonth() - 1);

    const [lastMonthPropertyCount, lastMonthUserCount, lastMonthBookingCount, lastMonthRevenue] = await Promise.all([
      propertyListingModel.countDocuments({ createdAt: { $lt: lastMonthDate } }),
      userModel.countDocuments({ createdAt: { $lt: lastMonthDate } }),
      bookingModel.countDocuments({ createdAt: { $lt: lastMonthDate } }),
      bookingModel.aggregate([
        { 
          $match: { 
            status: { $in: ['confirmed', 'completed'] },
            createdAt: { $lt: lastMonthDate }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    const recentActivities = [
      ...recentBookings.map(booking => ({
        type: 'New Booking',
        description: `Booking for ${booking.propertyId?.title || 'Deleted Property'} by ${booking.userId?.fullName || 'Deleted User'}`,
        time: booking.createdAt,
        icon: 'FaCalendarAlt',
        color: 'bg-purple-100 text-purple-600'
      })),
      ...recentProperties.map(property => ({
        type: 'New Property',
        description: `${property.title} added by ${property.userId?.fullName || 'Deleted User'}`,
        time: property.createdAt,
        icon: 'FaHome',
        color: 'bg-blue-100 text-blue-600'
      })),
      ...recentUsers.map(user => ({
        type: 'New User',
        description: `${user.fullName} (${user.email}) joined`,
        time: user.createdAt,
        icon: 'FaUserPlus',
        color: 'bg-green-100 text-green-600'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time))
     .slice(0, 5);

    const calculateGrowthPercentage = (previousValue, currentValue) => {
      if (previousValue === 0) {
        return currentValue === 0 ? '0%' : `+${currentValue * 100}%`;
      }
      const growth = ((currentValue - previousValue) / previousValue) * 100;
      return `${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%`;
    };

    res.status(200).json({
      success: true,
      data: {
        propertyCount,
        userCount,
        bookingCount,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentActivities,
        propertyGrowth: calculateGrowthPercentage(lastMonthPropertyCount, propertyCount),
        userGrowth: calculateGrowthPercentage(lastMonthUserCount, userCount),
        bookingGrowth: calculateGrowthPercentage(lastMonthBookingCount, bookingCount),
        revenueGrowth: calculateGrowthPercentage(lastMonthRevenue[0]?.total || 0, totalRevenue[0]?.total || 0),
        bookingTrends: await getBookingTrendsData(),
        revenueAnalysis: await getRevenueAnalysisData()
      }
    });
  } catch (error) {
    console.error('Error in getDashboardStats controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
};

async function getBookingTrendsData() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await bookingModel.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return trends.map(item => ({
      month: monthNames[item._id.month - 1],
      bookings: item.bookings,
      revenue: item.revenue
    }));
  } catch (error) {
    console.error('Error fetching booking trends:', error);
    return [];
  }
}

async function getRevenueAnalysisData() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueData = await bookingModel.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return revenueData.map(item => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue,
      bookings: item.bookings,
      average: Math.round(item.revenue / item.bookings) || 0
    }));
  } catch (error) {
    console.error('Error fetching revenue analysis:', error);
    return [];
  }
}
