const axios = require("axios");
require("dotenv").config();

const api = axios.create({
    baseURL: process.env.BASE_URL_API,
});

exports.showRegisterForm = (req, res) => res.render("auth/register", {
    title: "Sign up",
    fieldErrors: {},
    values: {},
});

exports.showLoginForm = (req, res) => res.render("auth/login", {
    title: "Sign in",
    error: null,
    values: {},
});

exports.register = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        await api.post("/auth/register", {
            username: username,
            email: email,
            password: password,
        });

        return res.redirect("/login");

    } catch (err) {
        const data = err.response?.data;

        const fieldErrors = {};
        const validations = data.error?.validations || [];

        for (const validation of validations) {
            fieldErrors[validation.field] = validation.message;
        }

        if (data.error?.code === "EMAIL_ALREADY_EXISTS") {
            fieldErrors.email = data.error?.message;
        }

        return res.render("auth/register", {
            title: "Sign up",
            fieldErrors: fieldErrors,
            values: {username, email},
        });
    }
};
