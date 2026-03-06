require("dotenv").config();

const express = require("express");
const path = require("path");
const logger = require("morgan");

/**
 * Defined router
 * */
const appRouter = require("./routes/app.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"));
}

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.req = req;
    next();
});

/**
 * Principals routes
 * */
app.use("/", [appRouter, authRouter]);

app.use((req, res, next) => next(res.status(404).json({
    error: {
        code: "ROUTE_NOT_FOUND",
        message: `Route ${req.method} ${req.path} not found`,
    },
})));

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const message =
        process.env.NODE_ENV === "production" && statusCode === 500
            ? "An unexpected error occurred"
            : err.message;

    return next(res.status(statusCode).json({
        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",
            message: message,
            stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
        },
    }));
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
