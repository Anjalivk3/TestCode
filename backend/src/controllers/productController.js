const Product = require('../models/Product');

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function getProducts(req, res, next) {
  try {
    const query = {};
    if (req.query.q) query.name = { $regex: escapeRegex(req.query.q), $options: 'i' };
    const category = String(req.query.category || '');
    if (category && category.toLowerCase() !== 'all') query.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
    const sort = req.query.sort === 'price-low' ? { price: 1 } : req.query.sort === 'price-high' ? { price: -1 } : { createdAt: 1 };
    const products = await Product.find(query).sort(sort).lean();
    return res.json({ success: true, products: products.map(({ _id, ...product }) => ({ ...product, id: _id.toString() })) });
  } catch (error) { return next(error); }
}

module.exports = { getProducts };
