var express = require('express');
var router = express.Router();
var passport = require('passport');
const {
    check
} = require('express-validator');
var csrf = require("csurf");
var csrfprotection = csrf();

router.use(csrfprotection);

router.get("/profile", isLoggedIn, function (req, res, next) {
    res.render("user/profile");
});

router.get("/logout", isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect("/")
});

router.use("/", notLoggedIn, function (req, res, next) {
    next();
});

router.get("/signup", function (req, res, next) {
    var messages = req.flash("error");
    res.render("user/signup", {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length
    });
});

router.post("/signup", [check('firstname').not().isEmpty().withMessage('First Name is required.'),
    check('lastname').not().isEmpty().withMessage('Last Name is required.'),
    check('email').not().isEmpty().isEmail().withMessage('Invalid E-mail.'),
    check('password').isLength({
        min: 4
    }).withMessage('Invalid password. Minimum 4 characters required.'),
    check('location').not().isEmpty().withMessage('Location is required.')
], passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup",
    failureFlash: true
}));

router.get("/signin", function (req, res, next) {
    var messages = req.flash("error");
    res.render("user/signin", {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length
    });
});

router.post("/signin", passport.authenticate("local.signin", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signin",
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect("/")
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    }
    return res.redirect("/")
}