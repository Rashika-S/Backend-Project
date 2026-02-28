const express = require('express');
const router = express.Router();
const { getQuestions, submitTest, getRecommendationsForUser } = require('../controllers/testController');
const { authVerify } = require('../middleware/authVerify');

router.get('/questions', getQuestions);
router.post('/submit', authVerify, submitTest);
router.get('/recommendations/:userId', authVerify, getRecommendationsForUser);

module.exports = router;
