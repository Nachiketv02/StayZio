const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../../controller/user/user.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const propertyListingController = require("../../controller/user/properttyListing.controller");
const upload = require("../../middleware/upload");
const bookingController = require("../../controller/user/booking.controller");
const reviewController = require("../../controller/user/review.controller");

router.post('/register', [
    body('fullName').trim().isString().withMessage("Name must be a string"),
    body('email').trim().isEmail().withMessage("Email must be a valid email"),
    body('phone').trim().isString().withMessage("Phone must be a string"),
    body('gender').trim().isString().withMessage("Gender must be a string"),
    body('password').trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body('confirmPassword').trim().isLength({ min: 6 }).withMessage("Confirm Password must be at least 6 characters long"),
], userController.register);

router.post('/verify', userController.verifyUser);

router.post('/resendOtp', userController.resendOtp);

router.post('/login',[
    body('email').trim().isEmail().withMessage("Email must be a valid email"),
    body('password').trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], userController.login);

router.post('/forgotPassword',[
    body('email').trim().isEmail().withMessage("Email must be a valid email")
], userController.forgotPassword);

router.put('/reset-password/:token', userController.resetPassword);

router.get('/profile', authMiddleware.isAuthenticated, userController.getProfile);

router.post('/logout', authMiddleware.isAuthenticated, userController.logoutUser);

// Property Listing Routes

// Update the property listing route
router.post(
  '/list-property',
  authMiddleware.isAuthenticated,
  upload.array('images', 10),
  [
    body('title').trim().notEmpty().withMessage("Title is required"),
    body('description').trim().notEmpty().withMessage("Description is required"),
    body('type').trim().notEmpty().withMessage("Type is required"),
    body('location').trim().notEmpty().withMessage("Location is required"),
    body('country').trim().notEmpty().withMessage("Country is required"),
    body('price').isNumeric().withMessage("Price must be a number"),
    body('bedrooms').isInt({ min: 0 }).withMessage("Bedrooms must be a positive integer"),
    body('bathrooms').isInt({ min: 0 }).withMessage("Bathrooms must be a positive integer"),
    body('amenities').optional().isArray().withMessage("Amenities must be an array"),
  ],
  propertyListingController.listProperty);

router.get('/properties', authMiddleware.isAuthenticated, propertyListingController.getAllProperties);

router.get('/my-properties', authMiddleware.isAuthenticated, propertyListingController.myProperties);

router.get('/property/:id', authMiddleware.isAuthenticated, propertyListingController.getPropertyById);

router.put('/property/:id', upload.array('images', 10), [
    body('title').trim().notEmpty().withMessage("Title is required"),
    body('description').trim().notEmpty().withMessage("Description is required"),
    body('type').trim().notEmpty().withMessage("Type is required"),
    body('location').trim().notEmpty().withMessage("Location is required"),
    body('country').trim().notEmpty().withMessage("Country is required"),
    body('price').isNumeric().withMessage("Price must be a number"),
    body('bedrooms').isInt({ min: 0 }).withMessage("Bedrooms must be a positive integer"),
    body('bathrooms').isInt({ min: 0 }).withMessage("Bathrooms must be a positive integer"),
    body('amenities').optional().isArray().withMessage("Amenities must be an array"),
  ], authMiddleware.isAuthenticated, propertyListingController.updateProperty);

router.delete('/property/:id', authMiddleware.isAuthenticated, propertyListingController.deleteProperty);

// Booking Routes

router.post('/book-property', authMiddleware.isAuthenticated, bookingController.createBooking);

router.get('/my-bookings', authMiddleware.isAuthenticated, bookingController.getMyBookings);

router.delete('/my-bookings/:id', authMiddleware.isAuthenticated, bookingController.deleteBooking);

router.get('/property/:id/bookings', authMiddleware.isAuthenticated, bookingController.getPropertyBookings);

// Review Routes

router.post('/review', [
  body('propertyId').isMongoId().withMessage("Invalid property ID"),
  body('bookingId').isMongoId().withMessage("Invalid booking ID"),
  body('rating').isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body('comment').trim().isLength({ min: 10, max: 500 }).withMessage("Comment must be between 10-500 characters")
], authMiddleware.isAuthenticated, reviewController.createReview);

router.get('/reviews', authMiddleware.isAuthenticated, reviewController.getMyReviews);

router.get('/property/:propertyId/reviews', authMiddleware.isAuthenticated, reviewController.getPropertyReviews);

router.delete('/review/:reviewId', authMiddleware.isAuthenticated, reviewController.deleteReview);

module.exports = router;
