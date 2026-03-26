const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const { redirectIfLoggedIn  } = require("./middleware/auth");

require("dotenv").config({ path: path.join(__dirname, "../config/.env") });

const PORT = process.env.PORT || 3000;

const app = express();

if (process.env.MONGO_URL) {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log(err);
        });
} else {
    console.warn("MONGO_URL is not set. Database connection was skipped.");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    "/bootstrap",
    express.static(path.join(__dirname, "..", "node_modules", "bootstrap", "dist"))
);
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use((req, res, next) => {
    res.locals.isLoggedIn = Boolean(req.session.userId);
    next();
});

app.use(authRoutes);
app.use(taskRoutes);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", redirectIfLoggedIn, (req, res) => {
    const flash = req.session.flash;
    const sessionData = flash ? JSON.stringify(req.session, null, 2) : null;
    delete req.session.flash;
    res.render("login", { flash, sessionData });
});

app.get("/register", redirectIfLoggedIn, (req, res) => {
    res.render("register");
}); 


app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
