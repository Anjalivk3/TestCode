const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product').lean();
    const items = (cart?.items || []).filter((item) => item.product).map(({ product, quantity }) => ({
      id: product._id.toString(), name: product.name, category: product.category,
      price: product.price, oldPrice: product.oldPrice, discount: product.discount,
      rating: product.rating, reviews: product.reviews, image: product.image, quantity,
    }));
    return res.json({ success: true, items, subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0) });
  } catch (error) { return next(error); }
}

async function addToCart(req, res, next) {
  try {
    const { productId } = req.body || {};
    const quantity = Number(req.body?.quantity ?? 1);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ success: false, message: 'Choose a valid product and quantity.' });
    }
    const product = mongoose.isObjectIdOrHexString(productId)
      ? await Product.findById(productId)
      : await Product.findOne({ legacyId: Number(productId) });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    const item = cart.items.find((entry) => entry.product.toString() === product._id.toString());
    if (item) item.quantity = Math.min(item.quantity + quantity, 99);
    else cart.items.push({ product: product._id, quantity });
    await cart.save();
    return res.status(200).json({ success: true, message: 'Product added to cart.' });
  } catch (error) { return next(error); }
}

async function updateCartQuantity(req, res, next) {
  try {
    const { productId } = req.body || {};
    const quantity = Number(req.body?.quantity);
    if (!mongoose.isObjectIdOrHexString(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ success: false, message: 'Choose a valid product and quantity.' });
    }
    const cart = await Cart.findOne({ user: req.user.id });
    const item = cart?.items.find((entry) => entry.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: 'Product not found in cart.' });
    item.quantity = quantity;
    await cart.save();
    return res.json({ success: true, message: 'Cart updated.' });
  } catch (error) { return next(error); }
}

async function removeFromCart(req, res, next) {
  try {
    const { productId } = req.params;
    if (!mongoose.isObjectIdOrHexString(productId)) return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    return res.json({ success: true, message: 'Product removed from cart.' });
  } catch (error) { return next(error); }
}

module.exports = { getCart, addToCart, updateCartQuantity, removeFromCart };
