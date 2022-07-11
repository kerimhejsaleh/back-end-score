const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "med-in-outlook",
  api_key: "323351562377729",
  api_secret: "rmpRc5eCkoYDKqsI0BcBXL8IUhA",
});

module.exports = cloudinary;