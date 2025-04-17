const { validationResult } = require("express-validator");
const reviewModel = require("../../model/user/review.model");
const userModel = require("../../model/user/user.model");
const bookingModel = require("../../model/user/booking.model");
const propertyListingModel = require("../../model/user/propertyListing.model");

module.exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { propertyId, bookingId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if booking exists, belongs to user, and is completed
    const booking = await bookingModel.findOne({
      _id: bookingId,
      userId,
      propertyId,
      status: 'completed' // Add status check
    });

    if (!booking) {
      return res.status(404).json({ 
        message: "Booking not found, doesn't belong to you, or isn't completed" 
      });
    }

    // Remove date check since we're using status now
    // const today = new Date();
    // if (new Date(booking.checkOut) > today) {
    //   return res.status(400).json({
    //     message: "You can only review after your booking period has ended",
    //   });
    // }

    // Check if user already reviewed this booking
    const existingReview = await reviewModel.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        message: "You've already reviewed this booking",
      });
    }

    // Create review
    const review = new reviewModel({
      propertyId,
      userId,
      bookingId,
      rating,
      comment,
    });

    await review.save();

    // Update property's average rating
    await updatePropertyRating(propertyId);

    // Update booking's reviewed status
    await bookingModel.findByIdAndUpdate(bookingId, { reviewed: true });

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error in createReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await reviewModel.find({ userId });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error in getMyReviews controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const reviews = await reviewModel.find({ propertyId }).populate('userId').populate('propertyId').populate('bookingId');
    if (!reviews) {
      return res
        .status(404)
        .json({ message: "No reviews found for this property" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error in getPropertyReviews controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await reviewModel.findOne({ userId, _id: reviewId });
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or doesn't belong to you" });
    }

    await review.deleteOne();

    await bookingModel.findByIdAndUpdate(review.bookingId, { reviewed: false });

    // Update property's average rating
    await recalculatePropertyRating(review.propertyId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function updatePropertyRating(propertyId) {
  const reviews = await reviewModel.find({ propertyId });
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await propertyListingModel.findByIdAndUpdate(propertyId, {
    rating: parseFloat(averageRating.toFixed(1)),
    reviewsCount: reviews.length,
  });
}

async function recalculatePropertyRating(propertyId) {
  const reviews = await reviewModel.find({ propertyId });

  if (reviews.length === 0) {
    await propertyListingModel.findByIdAndUpdate(propertyId, {
      rating: 0,
      reviewsCount: 0,
    });
    return;
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await propertyListingModel.findByIdAndUpdate(propertyId, {
    rating: parseFloat(averageRating.toFixed(1)),
    reviewsCount: reviews.length,
  });
}
