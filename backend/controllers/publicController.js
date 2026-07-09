const Category = require('../models/Category');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const path = require('path');


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

// @desc    Get single product by slug
// @route   GET /api/public/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching product' });
  }
};

// @desc    Get category and its products by slug
// @route   GET /api/public/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Product.find({ category: category._id, isActive: true });

    res.json({
      category,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching category' });
  }
};

// @desc    Download the Price List PDF
// @route   GET /api/public/price-list
// @access  Public
const downloadPriceList = (req, res) => {
  const filePath = path.join(__dirname, '../Diwali_Crackers_Price_List.pdf');
  res.download(filePath, 'Diwali_Crackers_Price_List.pdf', (err) => {
    if (err) {
      console.error('Error downloading the file:', err);
      if (!res.headersSent) {
        res.status(500).send('Error downloading file');
      }
    }
  });
};

module.exports = {
  getHomeData,
  getProductBySlug,
  getCategoryBySlug,
  downloadPriceList
};