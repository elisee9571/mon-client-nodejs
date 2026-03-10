const axios = require("axios");
require("dotenv").config();

const api = axios.create({
    baseURL: process.env.BASE_URL_API,
});

exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    try {
        const response = await api.get("/posts", {
            params: {
                page: page,
                size: size,
            },
        });

        const data = response?.data;

        return res.render("posts/index", {
            title: "Posts",
            posts: data.data,
            meta: data.meta,
        });

    } catch (err) {

        const data = err.response?.data;
        console.error(data);
    }
};

exports.show = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await api.get(`/posts/${id}`);

        const data = response?.data;

        return res.render("posts/show", {
            title: data.post.title,
            post: data.post,
            comments: data.comments,
            fieldErrors: {},
            values: {},
        });

    } catch (err) {

        const data = err.response?.data;
        console.error(data);
    }
};

exports.displayCreateForm = (req, res) => res.render("posts/new", {
    title: "New Post",
    fieldErrors: {},
    values: {},
});

exports.displayEditForm = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await api.get(`/posts/${id}`);

        const data = response?.data;

        return res.render("posts/edit", {
            title: "Edit Post",
            fieldErrors: {},
            values: data.post,
        });

    } catch (err) {

        const data = err.response?.data;
        console.error(data);
    }
};

exports.create = async (req, res) => {
    const { title, content, status } = req.body;

    try {
        const response = await api.post("/posts/new", {
            title: title,
            content: content,
            status: status,
        }, {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });

        return res.redirect(`/posts/${response.data.post._id}`);

    } catch (err) {

        const data = err.response?.data;

        const fieldErrors = {};
        const validations = data.error?.validations || [];

        for (const v of validations) {
            if (v.field) {
                fieldErrors[v.field] = v.message;
            }
        }

        return res.render("posts/new", {
            title: "New post",
            fieldErrors: fieldErrors,
            values: { title, content, status },
        });
    }
};

exports.edit = async (req, res) => {
    const { id } = req.params;
    const { title, content, status } = req.body;

    try {
        await api.patch(`/posts/${id}`, {
            title: title,
            content: content,
            status: status,
        }, {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });

        return res.redirect(`/posts/${id}`);

    } catch (err) {

        const data = err.response?.data;

        const fieldErrors = {};
        const validations = data.error?.validations || [];

        for (const v of validations) {
            if (v.field) {
                fieldErrors[v.field] = v.message;
            }
        }

        return res.render("posts/edit", {
            title: "Edit post",
            fieldErrors: fieldErrors,
            values: { title, content, status },
        });
    }
};
