const express = require("express");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../config/.env") });

const PORT = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    "/bootstrap",
    express.static(path.join(__dirname, "..", "node_modules", "bootstrap", "dist"))
);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
