const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../../middleware/auth.middleware");
const propertyController = require("../../controller/admin/property.controller");
const upload = require("../../middleware/upload");
const userController = require("../../controller/admin/user.controller");

// Property Routes

router.get('/properties', authMiddleware.isAuthenticated, authMiddleware.isAdmin, propertyController.getProperties);
router.post('/property', upload.array('images', 10), authMiddleware.isAuthenticated, authMiddleware.isAdmin, propertyController.createProperty);
router.put('/property/:id', upload.array('images', 10), authMiddleware.isAuthenticated, authMiddleware.isAdmin, propertyController.updateProperty);
router.delete('/property/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, propertyController.deleteProperty);

// User Routes

router.get('/users', authMiddleware.isAuthenticated, authMiddleware.isAdmin, userController.getAllUser);
router.put('/user/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, userController.updateUser);
router.delete('/user/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
