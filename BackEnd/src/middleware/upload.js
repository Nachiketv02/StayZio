const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {cloudinary} = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "StayZio_Dev",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1000, height: 750, crop: "limit" }],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;