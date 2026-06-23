const express = require('express');
const router = express.Router();

const { verifyToken, checkPermission } = require('../modules/shared/middleware/authMiddleware');
const authCtrl = require('../modules/core/auth/authController');
const roleCtrl = require('../modules/core/roles/roleController');
const userRoutes = require('../modules/core/users/userRoutes');
const assetRoutes = require('../modules/asset-management/routes');

// Auth
router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);

router.use(verifyToken);

// Core: Roles & Permissions
router.get('/permissions', checkPermission('Manajemen Role & Permission', 'Read/View'), roleCtrl.getPermissions);
router.get('/roles', checkPermission('Manajemen Role & Permission', 'Read/View'), roleCtrl.getRoles);
router.post('/roles', checkPermission('Manajemen Role & Permission', 'Create'), roleCtrl.createRole);
router.put('/roles/:id', checkPermission('Manajemen Role & Permission', 'Update'), roleCtrl.updateRole);
router.delete('/roles/:id', checkPermission('Manajemen Role & Permission', 'Delete'), roleCtrl.deleteRole);

// Core: Users
router.use('/users', userRoutes);

// Asset Management Routes
router.use('/', assetRoutes);

// Talent Management Routes
const talentRoutes = require('../modules/talent-management/routes');
router.use('/talent', talentRoutes);

module.exports = router;
