const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controllers");

router.get("/register", AuthController.showRegisterForm);
router.get("/login", AuthController.showLoginForm);

router.post("/register", AuthController.register);

module.exports = router;
