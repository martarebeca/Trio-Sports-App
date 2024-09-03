const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentControllers');
const verifyToken = require('../middlewares/verifyToken');


router.get('/getCommentsByActivity/:activity_id', verifyToken, commentController.getCommentsByActivity);
router.post('/addComment', verifyToken, commentController.addComment);

module.exports = router;
