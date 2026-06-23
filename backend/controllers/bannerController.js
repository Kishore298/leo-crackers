const Banner = require('../models/Banner');
const { uploadToCloudinary } = require('../utils/cloudinary');

// get all banners
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ displayOrder: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// create a banner
const createBanner = async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path) || imageUrl;
    }
    const banner = new Banner({ ...req.body, image: imageUrl });
    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(400).json({ message: 'Invalid banner data', error });
  }
};

// update a banner
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      const updateData = { ...req.body };
      if (req.file) {
        const imageUrl = await uploadToCloudinary(req.file.path);
        if (imageUrl) updateData.image = imageUrl;
      }
      Object.assign(banner, updateData);
      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error });
  }
};

// delete a banner
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await banner.deleteOne();
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getBanners, createBanner, updateBanner, deleteBanner };
