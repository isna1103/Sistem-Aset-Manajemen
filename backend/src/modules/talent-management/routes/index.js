const express = require('express');
const router = express.Router();
const talentCtrl = require('../controllers/talentController');
const { verifyToken } = require('../../shared/middleware/authMiddleware');

router.use(verifyToken);

router.get('/', talentCtrl.getAll);
router.post('/', talentCtrl.create);

module.exports = router;
