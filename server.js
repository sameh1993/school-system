/**
 *      import modules for app 
 */
const express = require("express")
const app = express()
const path = require("path")
const db = require("./model/db").db
const cors = require("cors")
// const mssql = require("mssql")

const flash = require("connect-flash")
app.use(flash())

var session = require('express-session');
var MSSQLStore = require('connect-mssql')(session);

var config = {
  user: 'sa',
  password: 'admin123456',
  server: 'localhost',
  database: 'schoolDB'
}

const options = {
  ttl: 1000 * 60 * 60 * 24,
}

app.use(session({
  store: new MSSQLStore(config, options), // options are optional
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  },
}))

/***
 * invoce middlewares
 */

// set the view engine to ejs
app.set('view engine', ['ejs']);
// app.set('view engine', 'pug');

app.use(cors())
app.use(express.static(path.join(__dirname, "assets")))
app.use(express.static(path.join(__dirname, "views")))
app.use(express.static(path.join(__dirname, "node_modules")))



/*
 *    create a middlewares ( routes ) for app
 */



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// meddlewares routes
app.use((req, res, next) => {
  db('select * from configeration').then(resault => {
    req.dataSchool = resault
  })
  next()
})

const HomeRoutes = require("./routes/home.router")
app.use("/", HomeRoutes)

const teacherRoutes = require("./routes/teacher.router")
app.use("/teacher", teacherRoutes)

const StudentRoutes = require("./routes/student.router")
app.use("/student", StudentRoutes)

const resaultRoutes = require("./routes/exam.route")
app.use('/exam', resaultRoutes)

const classRoutes = require("./routes/class.route")
app.use('/class', classRoutes)

const authRoutes = require("./routes/auth.route")
app.use("/auth", authRoutes)


const port = process.env.PORT || 3000

app.listen(port, () => console.log(`this server working on port ${port}`))