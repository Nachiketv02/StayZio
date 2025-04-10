const { validationResult } = require("express-validator");
const propertyListingModel = require("../../model/user/propertyListing.model");
const userModel = require("../../model/user/user.model");
const bookingModel = require("../../model/user/booking.model");

module.exports.createBooking = async (req, res) => {
  try {
    const { checkIn, checkOut, guests, paymentMethod, propertyId } = req.body;

    if (!checkIn || !checkOut || !guests || !paymentMethod || !propertyId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const property = await propertyListingModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (checkIn >= checkOut) {
      return res
        .status(400)
        .json({ message: "Check-in date must be before check-out date" });
    }

    const conflictingBooking = await bookingModel.findOne({
      propertyId,
      checkIn: { $lte: checkOut },
      checkOut: { $gte: checkIn },
    });
    if (conflictingBooking) {
      return res
        .status(400)
        .json({ message: "Property is already booked for this date" });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = new bookingModel({
      checkIn,
      checkOut,
      guests,
      paymentMethod,
      propertyId,
      userId: user._id,
    });

    await booking.save();

    res.status(200).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("Error in createBooking controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find({ userId: req.user._id });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error in getMyBookings controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const booking = await bookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this booking" });
    }
    await booking.deleteOne();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBooking controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
