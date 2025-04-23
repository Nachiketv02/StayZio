const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../../middleware/auth.middleware");
const propertyController = require("../../controller/admin/property.controller");
const upload = require("../../middleware/upload");
const userController = require("../../controller/admin/user.controller");
const bookingController = require("../../controller/admin/booking.controller");
const dashboardController = require("../../controller/admin/dashboard.controller");
const reportController = require("../../controller/admin/report.controller");

// Property Routes

router.get('/properties', authMiddleware.isAuthenticated, authMiddleware.isAdmin, propertyController.getProperties);
router.post('/property', upload.array('images', 10), authMiddleware.isAuthenticated, authMiddleware.isAdmin, propertyController.createProperty);
router.put('/property/:id', upload.array('images', 10), authMiddleware.isAuthenticated, authMiddleware.isAdmin, propertyController.updateProperty);
router.delete('/property/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, propertyController.deleteProperty);

// User Routes

router.get('/users', authMiddleware.isAuthenticated, authMiddleware.isAdmin, userController.getAllUser);
router.put('/user/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, userController.updateUser);
router.delete('/user/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, userController.deleteUser);

// Booking Routes

router.get('/bookings', authMiddleware.isAuthenticated, authMiddleware.isAdmin, bookingController.getBookings);

// Dashboard Routes

router.get('/dashboard', authMiddleware.isAuthenticated, authMiddleware.isAdmin, dashboardController.getDashboardStats);

// Report Routes
router.get('/reports', authMiddleware.isAuthenticated, authMiddleware.isAdmin, reportController.getReports);

router.get('/reports/export', authMiddleware.isAuthenticated, authMiddleware.isAdmin, reportController.exportReport);

module.exports = router;
