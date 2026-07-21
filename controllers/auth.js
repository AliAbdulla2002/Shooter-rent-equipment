const User = require('../models/user')
const bcrypt = require('bcrypt')

const showSignUpForm = function (req, res) {
    res.render('auth/sign-up.ejs')
}

const signUp = async function (req, res) {
    const userInDatabase = await User.findOne({
        username: req.body.username
    })

    if (userInDatabase) {
        return res.send('Username already taken.')
    }

    let userData = {}
    userData.username = req.body.username
    
    userData.email = req.body.email
    userData.role = req.body.role

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    userData.password = hashedPassword

    const user = await User.create(userData)

    req.session.user = {
        username: user.username,
        _id: user._id,
        role: user.role
    }
    req.session.save(function (){
        res.redirect('/')
    })
}

const showSignInForm = function (req, res) {
    res.render('auth/sign-in.ejs')
}

const signIn = async function (req, res) {
    const userInDatabase = await User.findOne({
        username: req.body.username
    })

    if (!userInDatabase) {
        return res.send('User does not exist.')
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)

    if(!validPassword) {
        return res.send('Login failed. Please try again.')
    }

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id,
        role: userInDatabase.role
    }
    req.session.save(function () {
        res.redirect('/')
    })
}

const signOut = async function (req, res) {
    req.session.destroy(function () {
        res.redirect('/')
    })
}

module.exports = {
    showSignUpForm,
    signUp,
    showSignInForm,
    signIn,
    signOut,
}