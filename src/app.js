import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'

import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRouter from './routes/view.routes.js'
import sessionRouter from './routes/session.routes.js'
import session  from 'express-session'
import initializePassport from './config/passport.config.js'
import passport from 'passport'


mongoose.set('strictQuery', false)

const app = express() // ! Iniciar sv con express

const MONGO_URI = "mongodb://localhost:27017";
const MONGO_DB_NAME = "coderhouse-sessions";

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      dbName: MONGO_DB_NAME,
    }),
    secret: "c0der",
    resave: true,
    saveUninitialized: true
  })
)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const ensureAuthenticated = (req, res, next) => {
  if(req.isAuthenticaed()) {
    return next()
  }
  res.redirect('/api/session/login')
}

// ? JSON SETUP
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// ? HANDLEBARS SETUP
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

// ? ROUTER SETUP
app.use('/api/products', ensureAuthenticated, productsRouter)
app.use('/api/carts', ensureAuthenticated, cartsRouter)
app.use('/api/session', sessionRouter)
app.use('/products', viewsRouter)

// ? MONGOOSE AND SERVER

mongoose
  .connect(MONGO_URI, {
    dbName: MONGO_DB_NAME,
  })
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.listen(8080, () => console.log("Server Up!"));