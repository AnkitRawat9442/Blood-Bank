const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/User");
const { render } = require("ejs");
const session = require('express-session');
const passport = require('passport');
const saltRounds = 10;

// homepage login  get request 
route.get("/" , (req, res)=>{
    res.render("homepage" , { title : "Raktdaan" , layout : "./layouts/homeLayout"});
})

// homepage login  post request 
route.post("/" , (req, res , next)=>{
  
    passport.authenticate('local', {
        successRedirect: '/user/user-dashboard',
        failureRedirect: '/',
        failureFlash :true,
      })(req , res , next);
     // console.log(req.body);

    // res.render("homepage" , { title : "Raktdaan" , layout : "./layouts/homeLayout"});
})


//
route.get("/register" , (req, res)=>{
    res.render("register" , {
        title : "Register" 
    });
})

route.post("/register" , (req , res)=>{
   
let {name , email , password ,  password2 , bloodgroup , State , district } = req.body;
let errors = [] ;
if(!name || !email || !password || !password2 || !bloodgroup || !State || !district){
 errors.push({msg : "Please fill all the field"});
}else { if (password.length < 6 ){
    errors.push({msg : "Password should be atleast 6 character"});
}else{ if(password !== password2){
    password = '';
    password2 = '';
    errors.push({msg : "Password do not match"});
}}
}

 if(errors.length > 0 ){
     console.log(errors);
     res.render ('register' ,  { title : "Register" , errors , name , email , password, password2 , bloodgroup , State , district  });

 }
 else{
    User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    errors.push({ msg: "Email already registered" });
                    res.render ('register' ,  { title : "Register" , errors , name , email , password, password2 , bloodgroup , State , district  });
                } else {
                    const newUser = new User({
                        name , email , password,  bloodgroup , State , district
                    });
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            // returns hash

                            newUser.password = hash;
                            // save newUser
                            newUser.save().then((user) => {
                                 req.flash('success_msg' , 'You are successfull registered');
                                res.redirect('/');
                            }).catch((err) => {
                                console.log(err)
                            });
                        });
                    });


                }
            });
 }
});



module.exports = route;


