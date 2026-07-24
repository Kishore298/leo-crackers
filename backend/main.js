const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const dns = require("node:dns");

// Force Node.js to use public DNS servers to resolve MongoDB SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://admin.leocrackers.com",
    "https://www.admin.leocrackers.com",
    "https://leocrackers.com",
    "https://www.leocrackers.com",
    "http://localhost:3000"
  ]
}));
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const importRoutes = require('./routes/importRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const discountRoutes = require('./routes/discountRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/import', importRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});