const express = require("express");
const router = express.Router();

const postsController = require("../controllers/posts.controllers");
const authMiddleware = require("../middlewares/auth.middlewares");

router.get("/", postsController.index);
router.get("/new", authMiddleware.checkAuth, postsController.displayCreateForm);
router.get("/:id", postsController.show);
router.get("/:id/edit", authMiddleware.checkAuth, postsController.displayEditForm);

router.post("/new", authMiddleware.checkAuth, postsController.create);
router.post("/:id/edit", authMiddleware.checkAuth, postsController.edit);

module.exports = router;
