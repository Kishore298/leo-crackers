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
      const rawCategoryName = row.category_name.trim();
      const categoryName = rawCategoryName.split('(')[0].trim();
      const categorySlug = categoryName.toLowerCase().replace(/[\s_]+/g, '-');
      
      let category = await Category.findOneAndUpdate(
        { slug: categorySlug },
        { $setOnInsert: { name: categoryName, slug: categorySlug } },
        { upsert: true, returnDocument: 'after' }
      );
      
      if (!processedCategories.has(category._id.toString())) {
        processedCategories.add(category._id.toString());
        categoryCount++;
      }

      if (row.product_name) {
        const productName = row.product_name.trim();
        const productSlug = productName.toLowerCase().replace(/[\s_]+/g, '-');
        
        const mrp = Number(row.mrp) || 0;
        const actualPrice = Math.round(mrp - (mrp * (percentage / 100)));

        const updateData = {
          category: category._id
        };
        if (row.mrp !== undefined) {
          updateData.mrp = mrp;
          updateData.actualPrice = actualPrice;
        }

        const product = await Product.findOneAndUpdate(
          { slug: productSlug },
          { 
            $set: updateData,
            $setOnInsert: { name: productName }
          },
          { upsert: true, returnDocument: 'after' }
        );
        
        // We can't easily track new vs updated product count with upsert without extra checks, 
        // but let's just increment productCount for each row processed
        productCount++;
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
        mrp: row['Original Price (Rs.)'] || row['mrp'] || row['Rate Rs'] || row['actualPrice'] || 0
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
