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
    const { username, email, password } = req.body;

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
            values: { username, email },
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await api.post("/auth/login", {
            email: email,
            password: password,
        });

        const data = response?.data;
        req.session.accessToken = data.accessToken;
        req.session.userId = data.user._id.toString();

        const redirectTo = req.session.returnTo || "/";
        delete req.session.returnTo;

        return res.redirect(redirectTo);

    } catch (err) {
        const data = err.response?.data;

        return res.render("auth/login", {
            title: "Sign in",
            error: data.error?.message,
            values: { email },
        });
    }
};

exports.logout = async (req, res) => {
    await req.session.destroy();
    return res.redirect("/");
};
