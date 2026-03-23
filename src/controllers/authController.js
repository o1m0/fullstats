const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            passwordHash: hash,
        });

        await user.save();

        req.session.userId = user._id;

        res.redirect("/tasks");
    } catch (err) {
        console.log(err);
        res.status(500).send("Register error");
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            req.session.flash = {
                type: "error",
                message: "ユーザーが見つかりません",
            };
            return res.redirect("/login");
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) {
            req.session.flash = {
                type: "error",
                message: "パスワードが正しくありません",
            };
            return res.redirect("/login");
        }

        req.session.userId = user._id;

        res.redirect("/tasks");
    } catch (err) {
        console.log(err);
        res.status(500).send("Login error");
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Logout error");
        }

        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};
