require("dotenv").config();

const express = require("express");
const path = require("path");
const logger = require("morgan");
const session = require("express-session");

/**
 * Defined router
 * */
const appRouter = require("./routes/app.routes");
const authRouter = require("./routes/auth.routes");
const usersRouter = require("./routes/users.routes");
const postsRouter = require("./routes/posts.routes");
const commentsRouter = require("./routes/comments.routes");

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"));
}

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.req = req;
    next();
});

/**
 * Principals routes
 * */
app.use("/", [appRouter, authRouter]);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

app.use((req, res, _next) => res.status(404).render("error", {
    title: "Error 404",
    error: {
        code: "ROUTE_NOT_FOUND",
        message: process.env.NODE_ENV !== "production" ? `Route ${req.method} ${req.path} not found` : "Page not found",
    },
}));

app.use((err, req, res, _next) => {
    const statusCode = err.statusCode || err.status || 500;
    const message =
        process.env.NODE_ENV === "production" && statusCode === 500
            ? "An unexpected error occurred"
            : err.message;

    return res.status(statusCode).render("error", {
        title: "Error server",
        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",
            message: message,
            stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
        },
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
