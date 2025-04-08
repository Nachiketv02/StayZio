const { validationResult } = require("express-validator");
const propertyListingModel = require("../../model/user/propertyListing.model");

module.exports.listProperty = async (req, res) => {
  try {
    // First check for files (must come before validation)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Then run validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Process amenities - handle both FormData and JSON
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

    // Create property
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