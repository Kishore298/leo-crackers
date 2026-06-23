const Category = require('../models/Category');
const { uploadToCloudinary } = require('../utils/cloudinary');

// get all categories 
const getCategories = async (req, res) => {
  try {
    const { search, isActive, sortBy = 'name', order = 'asc', page = 1, limit = 50 } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [categories, total] = await Promise.all([
      Category.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Category.countDocuments(filter)
    ]);
    res.json({ categories, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// create a category 
const createCategory = async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path) || imageUrl;
    }

    // Auto-create slug if missing
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
    }

    const category = new Category({ ...req.body, image: imageUrl });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid category data' });
  }
};

// update a category 
const updateCategory = async (req, res) => {
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

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after', runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Update failed' });
  }
};

// delete a category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };