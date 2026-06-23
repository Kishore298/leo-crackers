const xlsx = require('xlsx');
const Category = require('../models/Category');
const Product = require('../models/Product');

// import data from excel
const importData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const fileBuffer = req.file.buffer;
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let categoryCount = 0;
    let productCount = 0;

    for (const row of sheetData) {
      if (row.category_name) {
        let category = await Category.findOne({ name: row.category_name });
        if (!category) {
          const slug = row.category_name.toLowerCase().replace(/ /g, '-');
          category = await Category.create({ name: row.category_name, slug });
          categoryCount++;
        }

        if (row.product_name) {
          const productSlug = row.product_name.toLowerCase().replace(/ /g, '-');
          const existingProduct = await Product.findOne({ slug: productSlug, category: category._id });

          if (existingProduct) {
            existingProduct.actualPrice = row.actualPrice || existingProduct.actualPrice;
            existingProduct.description = row.description || existingProduct.description;
            await existingProduct.save();
          } else {
            await Product.create({
              name: row.product_name,
              slug: productSlug,
              category: category._id,
              description: row.description,
              actualPrice: row.actualPrice || 0
            });
            productCount++;
          }
        }
      }
    }

    res.json({ message: `Import successful. Created ${categoryCount} categories and ${productCount} products.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during import' });
  }
};

module.exports = { importData };
