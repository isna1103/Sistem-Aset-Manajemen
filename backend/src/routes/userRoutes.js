const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkPermission } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', checkPermission('Manajemen User', 'Read/View'), userController.getAllUsers);
router.post('/', checkPermission('Manajemen User', 'Create'), userController.createUser);
router.put('/:id', checkPermission('Manajemen User', 'Update'), userController.updateUser);
router.delete('/:id', checkPermission('Manajemen User', 'Delete'), userController.deleteUser);

module.exports = router;
