const bookingModel = require("../model/user/booking.model");
const userModel = require("../model/user/user.model");
const cron = require("node-cron");

const bookingAutomation = async () => {
  try {
    const now = new Date();

    const completedBookings = await bookingModel.updateMany(
      {
        checkOut: { $lt: now },
        status: "confirmed",
      },
      {
        $set: { status: "completed" },
      }
    );

    console.log(
      `Booking automation: Updated ${completedBookings.modifiedCount} bookings to 'completed' status`
    );

    return {
      success: true,
      updatedCount: completedBookings.modifiedCount,
    };
  } catch (error) {
    console.error("Error in bookingAutomation:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

const removeUnverifiedUsers = async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await userModel.deleteMany({
      isVerified: false,
      createdAt: { $lte: fiveMinutesAgo },
    });
    console.log("Cleaned up unverified users");
  } catch (error) {
    console.error("Error cleaning up unverified users:", error);
  }
};

console.log("Starting cron job scheduler...");
cron.schedule("0 * * * *", async () => {
  await bookingAutomation();
  await removeUnverifiedUsers();
});
