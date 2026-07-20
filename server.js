const dns = require("node:dns");

// DNS workaround for MongoDB Atlas.
// Remove these two lines if your regular DNS works correctly.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()

const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")
const session = require('express-session')
const { MongoStore } = require('connect-mongo')
const upload = require('./config/multer')

const isSignedIn = require('./middleware/is-signed-in')
const passUserToView = require('./middleware/pass-user-to-view')

const authCtrl = require('./controllers/auth')
const equipmentCtrl = require('./controllers/equipment')

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000"


mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", function (){
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})


app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}))
app.use(passUserToView)


app.get('/', (req, res) => {
    res.render('home.ejs', {
        user: req.session.user,
    })
})

// AUTH ROUTERS
app.get('/auth/sign-up', authCtrl.showSignUpForm )
app.post('/auth/sign-up', authCtrl.signUp)
app.get('/auth/sign-in', authCtrl.showSignInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.delete('/auth/sign-out', authCtrl.signOut)

// EQUIPMENT ROUTERS
app.get('/equipment/new', isSignedIn, equipmentCtrl.showNewForm)
app.post('/equipment', isSignedIn, upload.single('image'), equipmentCtrl.create)
app.get('/equipment', equipmentCtrl.index)
app.get('/equipment/:equipmentId', isSignedIn, equipmentCtrl.show)
app.delete('/equipment/:equipmentId', isSignedIn, equipmentCtrl.deleteEquipment)
app.get('/equipment/:equipmentId/edit', isSignedIn, equipmentCtrl.edit )
app.put('/equipment/:equipmentId', isSignedIn, equipmentCtrl.update)

app.post('/equipment/:equipmentId/favorited-by/:userId', isSignedIn, equipmentCtrl.favorite) // from lecture if i dont have a time i will deleted
app.delete('/equipment/:equipmentId/favorited-by/:userId', isSignedIn, equipmentCtrl.unfavorite)


// HOMEE
app.get('/dashboard', isSignedIn, async function (req, res){
    res.render('dashboard.ejs')
})


// ADD THE  splat function ERROR LIKE LECTURE - Nabila
app.get('/*splat', function (req, res) {
    res.render('error.ejs', {
        msg: 404
    })
})

app.listen(port, function (){
  console.log(`The express app is ready on port ${port}!`)
})

