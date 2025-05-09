const { validationResult } = require("express-validator");
const propertyListingModel = require("../../model/user/propertyListing.model");
const userModel = require("../../model/user/user.model");
const bookingModel = require("../../model/user/booking.model");

module.exports.createBooking = async (req, res) => {
  try {
    const { checkIn, checkOut, guests, paymentMethod, propertyId, totalAmount } = req.body;

    if (!checkIn || !checkOut || !guests || !paymentMethod || !propertyId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const property = await propertyListingModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res
        .status(400)
        .json({ message: "Check-in date must be before check-out date" });
    }

    const conflictingBookings = await bookingModel.find({
      propertyId,
      status : "confirmed",
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    if (conflictingBookings.length > 0) {
      const formattedDates = conflictingBookings.map(booking => ({
        from: booking.checkIn.toISOString().split('T')[0],
        to: booking.checkOut.toISOString().split('T')[0]
      }));
      
      return res.status(400).json({ 
        message: "Property is already booked for some of the selected dates",
        conflictingDates: formattedDates
      });
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
      totalAmount,
      propertyId,
      userId: user._id,
    });
    booking.status = 'confirmed';

    await booking.save();

    res.status(200).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("Error in createBooking controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getPropertyBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await bookingModel.find({ propertyId: id });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getPropertyBookings controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find({ userId: req.user._id }).populate('propertyId');
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error in getMyBookings controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this booking" });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error in deleteBooking controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
