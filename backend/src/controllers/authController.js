const User = require('../models/User');
const RoleUpgradeRequest = require('../models/RoleUpgradeRequest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/email');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, language, categoryInInterest } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, language, categoryInInterest });
    const token = generateToken(user);
    res.status(201).json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Hardcoded admin credentials
    if (email === 'admin@quickdesk.com' && password === 'admin123') {
      const adminUser = {
        _id: 'admin_hardcoded',
        name: 'System Administrator',
        email: 'admin@quickdesk.com',
        role: 'admin',
        language: 'en',
        categoryInInterest: 'all',
        profileImage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const token = jwt.sign({ id: 'admin_hardcoded', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: adminUser });
    }
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, language, categoryInInterest, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, language, categoryInInterest, profileImage },
      { new: true }
    ).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

exports.requestUpgrade = async (req, res) => {
  try {
    const existing = await RoleUpgradeRequest.findOne({ requestedBy: req.user._id, status: 'pending' });
    if (existing) return res.status(409).json({ message: 'Upgrade request already pending' });
    const request = await RoleUpgradeRequest.create({ requestedBy: req.user._id });
    // Optionally notify admin
    await sendEmail(process.env.EMAIL_USER, 'New Role Upgrade Request', `User ${req.user.email} requested agent role.`);
    res.status(201).json({ message: 'Upgrade request submitted', request });
  } catch (err) {
    res.status(500).json({ message: 'Upgrade request failed', error: err.message });
  }
};

exports.getUpgradeRequests = async (req, res) => {
  try {
    const requests = await RoleUpgradeRequest.find().populate('requestedBy', 'name email role');
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
  }
};

exports.approveUpgrade = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    const request = await RoleUpgradeRequest.findById(requestId);
    if (!request || request.status !== 'pending') return res.status(404).json({ message: 'Request not found or already handled' });
    request.status = status;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();
    if (status === 'approved') {
      await User.findByIdAndUpdate(request.requestedBy, { role: 'agent' });
      // Notify user
      const user = await User.findById(request.requestedBy);
      await sendEmail(user.email, 'Role Upgrade Approved', 'Your request to become an agent has been approved.');
    } else if (status === 'rejected') {
      const user = await User.findById(request.requestedBy);
      await sendEmail(user.email, 'Role Upgrade Rejected', 'Your request to become an agent has been rejected.');
    }
    res.json({ message: `Request ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process request', error: err.message });
  }
}; 