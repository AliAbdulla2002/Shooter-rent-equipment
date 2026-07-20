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


