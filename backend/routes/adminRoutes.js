const express = require('express');
const router = express.Router();
const { authVerify, adminOnly } = require('../middleware/authVerify');
const adminCtrl = require('../controllers/adminController');

router.use(authVerify, adminOnly); // protect all admin routes

router.post('/questions', adminCtrl.createQuestion);
router.put('/questions/:id', adminCtrl.updateQuestion);
router.delete('/questions/:id', adminCtrl.deleteQuestion);

router.post('/minors', adminCtrl.createMinor);
router.get('/minors', adminCtrl.getMinors);

module.exports = router;
