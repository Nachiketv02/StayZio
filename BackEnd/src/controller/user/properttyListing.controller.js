const { validationResult } = require("express-validator");
const propertyListingModel = require("../../model/user/propertyListing.model");
const userModel = require("../../model/user/user.model");


module.exports.listProperty = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    let amenities = [];
    if (req.body.amenities) {
      if (Array.isArray(req.body.amenities)) {
        amenities = req.body.amenities;
      } else {
        amenities = [req.body.amenities];
      }
    } else if (req.body['amenities[]']) {
      amenities = Array.isArray(req.body['amenities[]']) 
        ? req.body['amenities[]'] 
        : [req.body['amenities[]']];
    }

    const property = new propertyListingModel({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      location: req.body.location,
      country: req.body.country,
      price: req.body.price,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      amenities: amenities.filter(a => a && typeof a === 'string'),
      images: req.files.map(file => ({
        public_id: file.filename,
        url: file.path,
      })),
      userId: req.user._id,
    });

    await property.save();
    await userModel.findByIdAndUpdate(req.user._id, {isHost: true});

    return res.status(201).json({
      success: true,
      message: "Property listed successfully",
      data: property
    });
  } catch (error) {
    console.error("Error in listing property:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to list property. Please try again.",
    });
  }
};

module.exports.getAllProperties = async (req, res) => {
  try {
    const properties = await propertyListingModel.find({
      userId: { $ne: req.user._id }
    });
    return res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: properties
    });
  } catch (error) {
    console.error("Error in fetching properties:", error.message);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch properties. Please try again.",
    });
  }
};

module.exports.myProperties = async (req, res) => {
  try {
    const properties = await propertyListingModel.find({
      userId: req.user._id
    });
    return res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: properties
    });
  } catch (error) {
    console.error("Error in fetching properties:", error.message);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch properties. Please try again.",
    });
  }
};

module.exports.getPropertyById = async (req, res) => {
  try {
    const property = await propertyListingModel.findById(req.params.id).populate('userId');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found", 
      });
    }
    return res.status(200).json({
      success: true,
      message: "Property fetched successfully", 
      data: property
    });
  } catch (error) {
    console.error("Error in fetching property:", error.message);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch property. Please try again.",
    });
  }
};

module.exports.updateProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Get the current property first
    const currentProperty = await propertyListingModel.findById(req.params.id);
    if (!currentProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle images:
    // If new files are uploaded, combine with existing
    // If no new files, keep existing images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        public_id: file.filename,
        url: file.path,
      }));
      
      // Check if existingImages were sent from frontend
      const existingImages = req.body.existingImages 
        ? JSON.parse(req.body.existingImages)
        : currentProperty.images;

      updateData.images = [...existingImages, ...newImages];
    } else {
      // No new images uploaded - keep existing ones
      updateData.images = currentProperty.images;
    }

    const updatedProperty = await propertyListingModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.deleteProperty = async (req, res) => {
  try {
    const property = await propertyListingModel.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
      data: property
    });
  } catch (error) {
    console.error("Error in deleting property:", error.message);
    return res.status(400).json({
      success: false,
      message: "Failed to delete property. Please try again.",
    });
  }
};