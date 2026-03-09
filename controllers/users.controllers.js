const axios = require("axios");
require("dotenv").config();

const api = axios.create({
    baseURL: process.env.BASE_URL_API,
});

exports.profile = async (req, res) => {
    try {
        const response = await api.get("/users/profile", {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });

        const data = response?.data;

        return res.render("users/profile", {
            title: "Profile",
            user: data,
        });

    } catch (err) {

        const data = err.response?.data;
        console.error(data);
    }
};
