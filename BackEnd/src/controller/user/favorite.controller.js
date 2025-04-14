const favoriteModel = require("../../model/user/favorite.model");
const propertyListingModel = require("../../model/user/propertyListing.model");

module.exports.addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user._id;

    const property = await propertyListingModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const existingFavorite = await favoriteModel.findOne({
      userId,
      propertyId,
    });
    if (existingFavorite) {
      return res.status(400).json({ message: "Property already in favorites" });
    }

    const favorite = new favoriteModel({
      userId,
      propertyId,
    });

    await favorite.save();
    res.status(200).json({ message: "Property added to favorites", favorite });
  } catch (error) {
    console.error("Error adding property to favorites:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await favoriteModel.find({ userId }).populate('propertyId');
    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error in getFavorites controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    const property = await propertyListingModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const existingFavorite = await favoriteModel.findOne({
      userId,
      propertyId,
    });
    if (!existingFavorite) {
      return res.status(400).json({ message: "Property not in favorites" });
    }

    await existingFavorite.deleteOne();

    res.status(200).json({ message: "Property removed from favorites" });
  } catch (error) {
    console.error("Error removing property from favorites:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


