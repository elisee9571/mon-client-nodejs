const axios = require("axios");
require("dotenv").config();

const api = axios.create({
    baseURL: process.env.BASE_URL_API,
});

exports.create = async (req, res) => {
    const { postId } = req.params;
    const { message } = req.body;

    try {
        await api.post(`/comments/posts/${postId}`, {
            message: message,
        }, {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });

        return res.redirect(`/posts/${postId}`);

    } catch (err) {

        const data = err.response?.data;

        const fieldErrors = {};
        const validations = data?.error?.validations || [];

        for (const v of validations) {
            if (v.field) {
                fieldErrors[v.field] = v.message;
            }
        }

        try {
            const response = await api.get(`/posts/${postId}`);

            const data = response?.data;

            return res.render("posts/show", {
                title: data.post.title,
                post: data.post,
                comments: data.comments,
                fieldErrors: fieldErrors,
                values: { message },
            });

        } catch (fetchErr) {

            const data = fetchErr.response?.data;
            console.error(data);

            return res.redirect(`/posts/${postId}`);
        }

    }
};
