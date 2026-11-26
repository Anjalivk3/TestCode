require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const Product = require('./src/models/Product');
const products = require('./data/products');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.code === 11000 ? 409 : (error.statusCode || 500);
  res.status(status).json({ success: false, message: status === 500 ? 'Something went wrong' : (status === 409 ? 'Email already registered.' : error.message) });
});

async function startServer() {
  try {
    await connectDB();
    if (await Product.countDocuments() === 0) {
      await Product.insertMany(products.map(({ id, ...product }) => ({ ...product, legacyId: id })));
      console.log('Seeded the product catalog');
    }
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error('Could not start API:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) startServer();

module.exports = app;
