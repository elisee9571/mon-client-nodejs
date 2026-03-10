exports.checkAuth = (req, res, next) => {
    if (req.session && req.session.accessToken) {
        return next();
    }

    delete req.session.accessToken;
    delete req.session.userId;
    delete req.session.returnTo;

    // mémorise la page demandée
    req.session.returnTo = req.originalUrl;

    return res.redirect("/login");
};
