const bookingModel = require("../../model/user/booking.model");

module.exports.getBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find().populate('propertyId').populate('userId');
        if (!bookings) {
            return res.status(404).json({ message: "No bookings found" });
        }
        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error("Error in getBookings controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};