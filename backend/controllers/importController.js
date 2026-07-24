const xlsx = require('xlsx');
const pdf = require('pdf-parse');
const Category = require('../models/Category');
const Product = require('../models/Product');
const GlobalDiscount = require('../models/GlobalDiscount');

// Helper to process common data array
const processDataArray = async (sheetData) => {
  let categoryCount = 0;
  let productCount = 0;
  let processedCategories = new Set();
  
  const discount = await GlobalDiscount.findOne({});
  const percentage = discount && discount.isActive ? discount.discountPercentage : 0;

  for (const row of sheetData) {
    if (row.category_name) {
      let category = await Category.findOne({ name: row.category_name });
      if (!category) {
        const slug = row.category_name.toLowerCase().replace(/ /g, '-');
        category = await Category.create({ name: row.category_name, slug });
        processedCategories.add(category._id.toString());
        categoryCount++;
      } else if (!processedCategories.has(category._id.toString())) {
        processedCategories.add(category._id.toString());
        categoryCount++;
      }

      if (row.product_name) {
        const productSlug = row.product_name.toLowerCase().replace(/ /g, '-');
        const existingProduct = await Product.findOne({ slug: productSlug });
        
        const mrp = Number(row.mrp) || 0;
        const actualPrice = Math.round(mrp - (mrp * (percentage / 100)));

        if (existingProduct) {
          if (row.mrp !== undefined) {
             existingProduct.mrp = mrp;
             existingProduct.actualPrice = actualPrice;
          }
          existingProduct.category = category._id;
          await existingProduct.save();
        } else {
          await Product.create({
            name: row.product_name,
            slug: productSlug,
            category: category._id,
            mrp: mrp,
            actualPrice: actualPrice
          });
          productCount++;
        }
      }
    }
  }
  return { categoryCount, productCount };
};

// import data from excel or pdf
const importData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const fileName = req.file.originalname.toLowerCase();

    let sheetData = [];

    if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const data = await pdf(fileBuffer);
      const lines = data.text.split('\n').map(line => line.trim()).filter(line => line);

      let currentCategory = 'Imported Products';
      const skipKeywords = [
        'S.No', 'NAME OF THE PRODUCTS', 'RATE Rs', 'OFFER RATE',
        'PER', 'REQUIREMENT', 'AMOUNT', 'PRICELIST', 'Leo Crackers',
        'Fireworks', 'www.leocrackers.co.in', 'SIVAKASI', 'Product Name',
        'Quantity', 'Price', 'Diwali Crackers', 'Festival Special Offers'
      ];

      for (const line of lines) {
        // Format 1: S.No ProductName Rate OfferRate Per
        const rowMatch = line.match(/^(\d+)\s+(.+?)\s+([\d.]+)\s+([\d.]+)\s+(.+)$/);

        // Format 2 (Diwali PDF): S.No CategoryProductName ₹Rate ₹OfferRate Per (e.g. ₹421 Box -> 42 and 1 Box)
        const rupeeMatch = line.match(/^(\d+)\s+(.+?)₹([\d.]+)₹([\d.]+?)(1\s*[a-zA-Z]+)$/i);

        if (rupeeMatch) {
          let namePart = rupeeMatch[2].trim();
          const rate = parseFloat(rupeeMatch[3]);
          
          sheetData.push({
            category_name: 'Imported Products', // Fallback, since it's hard to split mashed strings
            product_name: namePart,
            mrp: rate
          });
        } else if (rowMatch) {
          const sno = rowMatch[1];
          const productName = rowMatch[2].trim();
          const rate = parseFloat(rowMatch[3]);
          
          if (productName && !isNaN(rate)) {
            sheetData.push({
              category_name: currentCategory,
              product_name: productName,
              mrp: rate
            });
          }
        } else {
          const isKeyword = skipKeywords.some(kw => line.toLowerCase().includes(kw.toLowerCase()));
          if (!isKeyword && isNaN(parseFloat(line)) && line.length > 2) {
            const catName = line.split('(')[0].trim();
            currentCategory = catName || line.trim();
          }
        }
      }
    } else {
      // Excel logic
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Normalize keys to match processDataArray expectations
      sheetData = rawData.map(row => ({
        category_name: row['Category'] || row['category_name'] || 'Uncategorized',
        product_name: row['Product Name'] || row['product_name'] || 'Unnamed Product',
        mrp: row['Original Price (Rs.)'] || row['mrp'] || row['Rate Rs'] || 0
      })).filter(row => row.product_name !== 'Unnamed Product');
    }

    const { categoryCount, productCount } = await processDataArray(sheetData);

    res.json({ message: `Import successful. Processed ${categoryCount} categories and ${productCount} products.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during import', error: error.message });
  }
};

module.exports = { importData };
