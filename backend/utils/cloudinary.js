const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_SECRET) {
      const fileName = require('path').basename(localFilePath);
      return `http://localhost:5000/uploads/${fileName}`;
    }

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    // file has been uploaded successfully
    fs.unlinkSync(localFilePath);
    return response.secure_url;
  } catch (error) {
    const fileName = require('path').basename(localFilePath);
    return `http://localhost:5000/uploads/${fileName}`;
  }
};

module.exports = { uploadToCloudinary };