const express = require("express");
const router = express.Router();

const AppController = require("../controllers/app.controllers");

router.get("/", AppController.showHome);

module.exports = router;
