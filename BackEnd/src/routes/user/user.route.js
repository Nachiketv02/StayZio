const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../../controller/user/user.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const propertyListingController = require("../../controller/user/properttyListing.controller");
const upload = require("../../middleware/upload");


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

router.post(
    '/list-property',
    upload.array('images', 10), // ✅ must come first to parse multipart/form-data
    [
      body('title').trim().notEmpty().withMessage("Title is required"),
      body('description').trim().notEmpty().withMessage("Description is required"),
      body('type').trim().notEmpty().withMessage("Type is required"),
      body('location').trim().notEmpty().withMessage("Location is required"),
      body('country').trim().notEmpty().withMessage("Country is required"),
      body('price').trim().notEmpty().withMessage("Price is required"),
      body('bedrooms').trim().notEmpty().withMessage("Bedrooms is required"),
      body('bathrooms').trim().notEmpty().withMessage("Bathrooms is required"),
      body('amenities').isArray().withMessage("Amenities must be an array"),
    ],
    authMiddleware.isAuthenticated,
    propertyListingController.listProperty
  );

module.exports = router;
