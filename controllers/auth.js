const User = require("../models/user");
const bcrypt = require("bcrypt");

const home = function (req, res){
    res.render("home.ejs", {
        user: req.session.user,
    });
};

const showSignUpForm = function (req, res){
    res.render("auth/sign-up.ejs", {
        user: req.session.user,
    });
};

const signUp = async function (req, res){
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Passwords do not match!");
    }

    const userInDatabase = await User.findOne({
        username: req.body.username,
    });

    if (userInDatabase) {
        return res.send("Username is already taken");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    };

    const user = await User.create(userData);

    req.session.user = {
        username: user.username,
        id: user.id,
        role: user.role
    };

    req.session.save(function (){
        res.redirect("/");
    });
};

const showSignInForm = function (req, res){
    res.render("auth/sign-in.ejs", {
        user: req.session.user,
    });
};

const signIn = async function (req, res){
    const userInDatabase = await User.findOne({
        username: req.body.username,
    });

    if (!userInDatabase) {
        return res.send("User does not exist");
    }

    const validPassword = await bcrypt.compare(
        req.body.password,
        userInDatabase.password
    );

    if (!validPassword) {
        return res.send("Login failed");
    }

    req.session.user = {
        username: userInDatabase.username,
        id: userInDatabase.id,
    };

    req.session.save(function (){
        res.redirect("/");
    });
};

const signOut = function (req, res){
    req.session.destroy(function (){
        res.redirect("/");
    });
};

const dashboard = function (req, res){
    res.render("dashboard.ejs", {
        user: req.session.user,
    });
};

module.exports = {
    home,
    showSignUpForm,
    signUp,
    showSignInForm,
    signIn,
    signOut,
    dashboard,
};