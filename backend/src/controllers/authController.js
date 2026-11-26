const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = () => process.env.JWT_SECRET || 'local-dev-secret-change-before-production';
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

async function registerUser(req, res, next) {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Enter your name, a valid email, and a password with at least 6 characters.' });
    }
    if (await User.findOne({ email })) return res.status(409).json({ success: false, message: 'Email already registered.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    return res.status(201).json({ success: true, message: 'Account created. Please log in.', user: publicUser(user) });
  } catch (error) { return next(error); }
}

async function loginUser(req, res, next) {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    const token = jwt.sign({ id: user._id.toString() }, jwtSecret(), { expiresIn: '7d' });
    return res.json({ success: true, message: 'Logged in successfully.', token, user: publicUser(user) });
  } catch (error) { return next(error); }
}

module.exports = { registerUser, loginUser };
