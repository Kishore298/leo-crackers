const Product = require('../models/Product');
const { uploadToCloudinary } = require('../utils/cloudinary');

// get all products with filter, sort, pagination
const getProducts = async (req, res) => {
  try {
    const { search, category, isActive, sortBy = 'name', order = 'asc', page = 1, limit = 50 } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name').sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ]);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// create a product 
const createProduct = async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path) || imageUrl;
    }

    // Auto-create slug if missing
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
    }

    const product = new Product({ ...req.body, image: imageUrl });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid product data' });
  }
};

// update a product
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.path);
      if (imageUrl) updateData.image = imageUrl;
    }

    // Auto-create slug if missing but name is provided
    if (!updateData.slug && updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after', runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Update failed' });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };