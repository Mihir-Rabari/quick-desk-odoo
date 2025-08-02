const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin panel controls
 */

// Categories
/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Add a new category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       403:
 *         description: Forbidden
 */
router.post('/categories', authMiddleware, roleMiddleware('admin'), adminController.addCategory);
/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       403:
 *         description: Forbidden
 */
router.get('/categories', authMiddleware, roleMiddleware('admin'), adminController.listCategories);
/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     summary: Edit a category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       403:
 *         description: Forbidden
 */
router.put('/categories/:id', authMiddleware, roleMiddleware('admin'), adminController.editCategory);
/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/categories/:id', authMiddleware, roleMiddleware('admin'), adminController.deleteCategory);

// Users
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get('/users', authMiddleware, roleMiddleware('admin'), adminController.listUsers);
/**
 * @swagger
 * /admin/users/{id}/role:
 *   put:
 *     summary: Change user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, agent, admin]
 *     responses:
 *       200:
 *         description: User role changed
 *       403:
 *         description: Forbidden
 */
router.put('/users/:id/role', authMiddleware, roleMiddleware('admin'), adminController.changeUserRole);
/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), adminController.deleteUser);

// Tickets
/**
 * @swagger
 * /admin/tickets:
 *   get:
 *     summary: List all tickets
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets
 *       403:
 *         description: Forbidden
 */
router.get('/tickets', authMiddleware, roleMiddleware('admin'), adminController.listTickets);
/**
 * @swagger
 * /admin/tickets/{id}:
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/tickets/:id', authMiddleware, roleMiddleware('admin'), adminController.deleteTicket);

// Questions
/**
 * @swagger
 * /admin/questions:
 *   get:
 *     summary: List all questions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of questions
 *       403:
 *         description: Forbidden
 */
router.get('/questions', authMiddleware, roleMiddleware('admin'), adminController.listQuestions);
/**
 * @swagger
 * /admin/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/questions/:id', authMiddleware, roleMiddleware('admin'), adminController.deleteQuestion);

// Advanced User Management
router.post('/users', authMiddleware, roleMiddleware('admin'), adminController.createUser);
router.put('/users/:id', authMiddleware, roleMiddleware('admin'), adminController.updateUser);
router.put('/users/:id/reset-password', authMiddleware, roleMiddleware('admin'), adminController.resetUserPassword);

// Dashboard & Analytics
router.get('/dashboard/stats', authMiddleware, roleMiddleware('admin'), adminController.getDashboardStats);

// Database Operations
router.get('/database/stats', authMiddleware, roleMiddleware('admin'), adminController.getDatabaseStats);
router.delete('/database/clear/:collectionName', authMiddleware, roleMiddleware('admin'), adminController.clearCollection);
router.get('/database/export/:type', authMiddleware, roleMiddleware('admin'), adminController.exportData);

// System Health
router.get('/system/health', authMiddleware, roleMiddleware('admin'), adminController.systemHealth);

// Bulk Operations
router.delete('/users/bulk', authMiddleware, roleMiddleware('admin'), adminController.bulkDeleteUsers);
router.put('/users/bulk/roles', authMiddleware, roleMiddleware('admin'), adminController.bulkChangeUserRoles);

module.exports = router;
