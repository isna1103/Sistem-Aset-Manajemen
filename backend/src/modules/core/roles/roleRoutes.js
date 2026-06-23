const express = require('express');
const router = express.Router();
const roleController = require('./roleController');
const { verifyToken, isAdmin } = require('../../shared/middleware/authMiddleware');

router.use(verifyToken);
// Only Admin can manage Roles
router.use(isAdmin);

router.get('/permissions', roleController.getPermissions);
router.get('/', roleController.getRoles);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
