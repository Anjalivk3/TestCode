const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getCart, addToCart, updateCartQuantity, removeFromCart } = require('../controllers/cartController');

const router = express.Router();
router.use(authMiddleware);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCartQuantity);
router.delete('/:productId', removeFromCart);

module.exports = router;
