const propertyListingModel = require("../../model/user/propertyListing.model");
const userModel = require("../../model/user/user.model");
const { validationResult } = require("express-validator");

module.exports.getProperties = async (req, res) => {
  try {
    const properties = await propertyListingModel.find().populate("userId");
    if (!properties) {
      return res.status(404).json({
        success: false,
        message: "Properties not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: properties,
    });
  } catch (error) {
    console.error("Error in fetching properties:", error.message);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch properties. Please try again.",
    });
  }
};

module.exports.createProperty = async (req, res) => {
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
    } else if (req.body["amenities[]"]) {
      amenities = Array.isArray(req.body["amenities[]"])
        ? req.body["amenities[]"]
        : [req.body["amenities[]"]];
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
      amenities: amenities.filter((a) => a && typeof a === "string"),
      images: req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      })),
      userId: req.user._id,
    });

    await property.save();
    await userModel.findByIdAndUpdate(req.user._id, { isHost: true });

    return res.status(201).json({
      success: true,
      message: "Property listed successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error in listing property:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to list property. Please try again.",
    });
  }
};

module.exports.updateProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const currentProperty = await propertyListingModel.findById(req.params.id);
    if (!currentProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));

      const existingImages = req.body.existingImages
        ? JSON.parse(req.body.existingImages)
        : currentProperty.images;

      updateData.images = [...existingImages, ...newImages];
    } else {
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
    const property = await propertyListingModel.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found", 
      });
    }
    await property.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Property deleted successfully", 
    });
  } catch (error) {
    console.error("Error deleting property:", error.message);
    return res.status(400).json({
      success: false,
      message: "Failed to delete property. Please try again.",
    });
  }
};