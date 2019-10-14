const express = require("express");
const methodOverride = require("method-override");
const app = express();
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const passport = require("passport");

// Connect to Database
mongoose
  .connect("mongodb://localhost:27017/vdesc-div", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => {
    console.log(err);
  });

// Passport Config
require("./config/passport")(passport);

// Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Connect Flash Midlleware
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Handlebars Middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Middleware bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Imports
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Index Route
app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "VDesc | Welcome"
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about", {
    pageTitle: "VDesc | About"
  });
});

// Use Ideas Routes
app.use("/ideas", ideas);

// Use Users Routes
app.use("/users", users);

// Error Page
app.use((req, res) => {
  res.render("error", {
    pageTitle: "VDesc | Page Not Found"
  });
});
const port = 5000;

app.listen(port, () => {
  console.log("Server is running ...");
});
