const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controllers");

router.get("/register", AuthController.showRegisterForm);
router.get("/login", AuthController.showLoginForm);
router.get("/logout", AuthController.logout);

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;
