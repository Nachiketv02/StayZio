const { validationResult } = require("express-validator");
const propertyListingModel = require("../../model/user/propertyListing.model");

module.exports.listProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      title,
      description,
      type,
      location,
      country,
      price,
      bedrooms,
      bathrooms,
      amenities,
    } = req.body;

    if (
      !title ||
      !description ||
      !type ||
      !location ||
      !country ||
      !price ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      !amenities
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const images = req.files.map(file => ({
      public_id: file.filename,
      url: file.path,
    }));

    const property = new propertyListingModel({
      title,
      description,
      type,
      location,
      country,
      price,
      bedrooms,
      bathrooms,
      amenities: Array.isArray(amenities) ? amenities : [amenities],
      images,
      userId: req.user._id,
    });

    await property.save();

    return res.status(201).json({
      success: true,
      message: "Property listed successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error in listing property:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
