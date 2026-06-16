const Category = require('../models/Category');
const Product = require('../models/Product');
const Banner = require('../models/Banner');

// @desc    Get home page data (Banners + Categories with Products)
// @route   GET /api/public/home
// @access  Public
const getHomeData = async (req, res) => {
  try {
    // Fetch active banners
    const banners = await Banner.find({ isActive: true }).sort({ displayOrder: 1 });

    // Fetch active categories and populate their products
    const categories = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        // Only get active products
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          image: 1,
          products: {
            $filter: {
              input: '$products',
              as: 'product',
              cond: { $eq: ['$$product.isActive', true] }
            }
          }
        }
      }
    ]);

    res.json({
      banners,
      categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching home data' });
  }
};

module.exports = {
  getHomeData
};