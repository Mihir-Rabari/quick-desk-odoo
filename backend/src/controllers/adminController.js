const Category = require('../models/Category');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Question = require('../models/Question');
const RoleUpgradeRequest = require('../models/RoleUpgradeRequest');
const TicketComment = require('../models/TicketComment');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Categories
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description, createdBy: req.user._id });
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add category', error: err.message });
  }
};
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
};
exports.editCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
};

// Users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change role', error: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

// Tickets
exports.listTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('createdBy assignedTo category', 'name email');
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: err.message });
  }
};
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete ticket', error: err.message });
  }
};

// Questions
exports.listQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('createdBy', 'name email');
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions', error: err.message });
  }
};
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete question', error: err.message });
  }
};

// Advanced User Management
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, language, categoryInInterest } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already exists' });
    
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hash, 
      role: role || 'user', 
      language: language || 'en', 
      categoryInInterest 
    });
    
    res.status(201).json({ user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, language, categoryInInterest } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { name, email, role, language, categoryInInterest }, 
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: 'New password required' });
    
    const hash = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { password: hash }, 
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
};

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const closedTickets = await Ticket.countDocuments({ status: 'closed' });
    const totalQuestions = await Question.countDocuments();
    const totalCategories = await Category.countDocuments();
    const pendingUpgradeRequests = await RoleUpgradeRequest.countDocuments({ status: 'pending' });
    
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentTickets = await Ticket.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name email');
    
    res.json({
      stats: {
        totalUsers,
        totalAgents,
        totalAdmins,
        totalTickets,
        openTickets,
        closedTickets,
        totalQuestions,
        totalCategories,
        pendingUpgradeRequests
      },
      recentUsers,
      recentTickets
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
  }
};

// Database Operations
exports.getDatabaseStats = async (req, res) => {
  try {
    const collections = await mongoose.connection.db.collections();
    const dbStats = [];
    
    for (let collection of collections) {
      const stats = await collection.stats();
      dbStats.push({
        name: collection.collectionName,
        count: stats.count,
        size: stats.size,
        avgObjSize: stats.avgObjSize,
        storageSize: stats.storageSize,
        indexes: stats.nindexes
      });
    }
    
    res.json({ dbStats });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch database stats', error: err.message });
  }
};

exports.clearCollection = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const allowedCollections = ['tickets', 'questions', 'ticketcomments', 'roleupgraderequests'];
    
    if (!allowedCollections.includes(collectionName.toLowerCase())) {
      return res.status(400).json({ message: 'Collection not allowed for clearing' });
    }
    
    const result = await mongoose.connection.db.collection(collectionName).deleteMany({});
    res.json({ message: `Cleared ${result.deletedCount} documents from ${collectionName}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear collection', error: err.message });
  }
};

exports.exportData = async (req, res) => {
  try {
    const { type } = req.params; // 'users', 'tickets', 'questions', 'all'
    let data = {};
    
    if (type === 'users' || type === 'all') {
      data.users = await User.find().select('-password');
    }
    if (type === 'tickets' || type === 'all') {
      data.tickets = await Ticket.find().populate('createdBy assignedTo', 'name email');
    }
    if (type === 'questions' || type === 'all') {
      data.questions = await Question.find().populate('createdBy', 'name email');
    }
    if (type === 'categories' || type === 'all') {
      data.categories = await Category.find();
    }
    
    res.json({ data, exportedAt: new Date() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to export data', error: err.message });
  }
};

// System Maintenance
exports.systemHealth = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    res.json({
      database: {
        status: dbStates[dbState],
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      server: {
        uptime: uptime,
        memory: {
          rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB',
          heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
          heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB'
        },
        nodeVersion: process.version,
        platform: process.platform
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get system health', error: err.message });
  }
};

// Bulk Operations
exports.bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Invalid user IDs array' });
    }
    
    const result = await User.deleteMany({ _id: { $in: userIds } });
    res.json({ message: `Deleted ${result.deletedCount} users` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to bulk delete users', error: err.message });
  }
};

exports.bulkChangeUserRoles = async (req, res) => {
  try {
    const { userIds, newRole } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0 || !newRole) {
      return res.status(400).json({ message: 'Invalid parameters' });
    }
    
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { role: newRole }
    );
    
    res.json({ message: `Updated ${result.modifiedCount} users to ${newRole} role` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to bulk change roles', error: err.message });
  }
};
