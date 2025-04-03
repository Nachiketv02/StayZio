const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../../controller/user/user.controller");


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

module.exports = router;
