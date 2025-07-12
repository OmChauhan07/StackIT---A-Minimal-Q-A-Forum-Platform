const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');

router.get('/:questionId', answerController.getAnswers);
router.post('/:questionId', answerController.createAnswer);

module.exports = router; 