const express = require("express");
const router = express.Router();

const commentsController = require("../controllers/comments.controllers");
const authMiddleware = require("../middlewares/auth.middlewares");

router.post("/posts/:postId", authMiddleware.checkAuth, commentsController.create);

module.exports = router;
