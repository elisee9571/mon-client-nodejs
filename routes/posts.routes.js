const express = require("express");
const router = express.Router();

const postsController = require("../controllers/posts.controllers");

router.get("/", postsController.index);
router.get("/new", postsController.displayCreateForm);
router.get("/:id", postsController.show);

router.post("/new", postsController.create);

module.exports = router;
