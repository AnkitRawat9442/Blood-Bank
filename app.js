const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

const PORT = process.env.PORT ||  1000;


// config database
const db = require("./config/mongoUri").MongoURI;

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("mongodb connected ...."))
    .catch(err => console.log(err)); 

// passport config
require('./config/passport')(passport);

// for diifernt layout 
app.use(expressLayouts)
app.set('layout' , './layouts/layout');
app.set('view engine' , 'ejs');

app.use(express.urlencoded({extended : false }));


//express session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}));


// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// using messqage 
app.use(flash());
app.use((req , res , next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})



// for using static file 
app.use('/public' , express.static("public"));

// using different router 
app.use("/" , require("./routes/index"));
app.use("/user" , require("./routes/user"));
app.use("/admin" , require("./routes/admin")) ;





app.listen(PORT , ()=>console.log("Server started at " + PORT ));
