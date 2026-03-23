exports.requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        req.session.flash = {
            type: "error",
            message: "ログインしてください",    
        };
        return res.redirect("/login");
    }
    next();
};

exports.redirectIfLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect("/tasks");
    }
    next();
};