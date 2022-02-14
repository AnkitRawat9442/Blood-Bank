const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const BloodRequest = require("../models/BloodRequest");
const BloodDonateDB= require("../models/BloodDonateDB");
const  https = require("https");


router.get("/user-dashboard" , ensureAuthenticated , (req , res)=>{
  
    res.render("user/dashboard" , { title : "User-Dashboard" , User_name : req.user.name, layout : "./layouts/dashboardLayout"});
})

// user logout handle 
router.get("/user-logout",(req , res )=>{
    req.logout();
    res.redirect("/");
})
 
// user find blood handle 
router.get("/findblood",(req , res )=>{
   
   
    

    res.render("user/findblood" , {title : "find Blood" ,User_name : req.user.name  , layout : "./layouts/dashboardLayout"});
})

router.post("/findblood",(req , res )=>{
    let req_status = [];
   
    console.log(req.body)
    console.log(req.user);
   // req_status.push({ val : 0, msg : "Successfully made a request"});
    const new_blood_Req = new BloodRequest({
        name: req.user.name,
        email: req.user.email,
        password: req.user.password,
        blood_group: req.body.bloodgroup,
        blood_unit: req.body.bloodunit,
        status: 'pending',

    });
    


    new_blood_Req.save().then((user)=>{
        
        req_status.push({ val : 1, msg : "Successfully made a request, You can check Status of Rrequest in Dashboard"});
        res.render("user/findblood" , {title : "find Blood" ,User_name : req.user.name, req_status :req_status   , layout : "./layouts/dashboardLayout"});
    }).catch((err)=>{
        req_status.push({val :0, msg : "Error try again! Please fill all field  "})
        console.log(err);
        res.render("user/findblood" , {title : "find Blood" ,User_name : req.user.name, req_status :req_status  , layout : "./layouts/dashboardLayout"});
    });

   
   
})



// user get  donate blood handler 
router.get("/donateblood" , (req , res) =>{
 
   res.render("user/donateblood" , {title : "Donate Blood " , User_name : req.user.name,  layout : "./layouts/dashboardLayout"});

})



// user post  donate blood handler 
router.post("/donateblood" , (req , res) =>{
   
    let req_status = [] ;
console.log(req.body);

    const new_blood_Req = new BloodDonateDB({
        name: req.user.name,
        email: req.user.email,
        password: req.user.password,
        blood_group: req.body.bloodgroup,
        blood_unit: req.body.bloodunit,
        status: 'pending',

    });
    


    new_blood_Req.save().then((user)=>{
        
        req_status.push({ val : 1, msg : "Successfully made a request, You can check Status of Request in Dashboard"});
        res.render("user/donateblood" , {title : "find Blood" ,User_name : req.user.name, req_status :req_status   , layout : "./layouts/dashboardLayout"});
    }).catch((err)=>{
        req_status.push({val :0, msg : "Error try again! Please fill all field  "})
        console.log(err);
        res.render("user/donateblood" , {title : "find Blood" ,User_name : req.user.name, req_status :req_status  , layout : "./layouts/dashboardLayout"});
    });
   
   

});
 

// get user  profile handler 
router.get("/profile" , (req , res) =>{
    console.log(req.user);
    
    res.render("user/profile" , {title : "Profile" , name : req.user.name , USER : req.user, layout  : "./layouts/userprofileLayout" });

 
 });

 // get request Status
 router.get("/req-status" , (req , res)=>{
 let REQ_PENDING = [];


    BloodRequest.find({email : req.user.email }, (err , data)=>{
        if(err){
            console.log(err)
        }else{
            data.forEach((d)=> {
                if(d.status == 'pending')
                {
                   // console.log(d);
                    REQ_PENDING.push(d);
                } 
               })
               res.render("user/req-status" , {title : "dashboard" , name : req.user.name,REQ_PENDING : REQ_PENDING, layout : "./layouts/userprofileLayout"});
        }
    });
    

   
 })
 

 
 // get request History 
 router.get("/REQhistory" , (req , res)=>{
    let REQ_HISTORY = [];
   
   
       BloodRequest.find({email : req.user.email }, (err , data)=>{
           if(err){
               console.log(err)
           }else{
               data.forEach((d)=> {
                   if(d.status == 'accepted' ||d.status == 'rejected' )
                   {
                      // console.log(d);
                      REQ_HISTORY.push(d);
                   } 
                  })
                  res.render("user/req-status" , {title : "dashboard" , name : req.user.name,REQ_HISTORY : REQ_HISTORY, layout : "./layouts/userprofileLayout"});
           }
       });
       
   
      
    });

  
 // get Donate Req 
 router.get("/DONATE_REQ" , (req , res)=>{
    let REQ_PENDING = [];
   
   
       BloodDonateDB.find({email : req.user.email }, (err , data)=>{
           if(err){
               console.log(err)
           }else{
               data.forEach((d)=> {
                   if(d.status == 'pending'  )
                   {
                      // console.log(d);
                      REQ_PENDING.push(d);
                   } 
                  })
                  res.render("user/req-status" , {title : "dashboard" , name : req.user.name,REQ_PENDING : REQ_PENDING, layout : "./layouts/userprofileLayout"});
           }
       });
       
   
      
    });
    
 // get Donate History 
 router.get("/DONATEhistory" , (req , res)=>{
    let REQ_HISTORY = [];
   
   
       BloodDonateDB.find({email : req.user.email }, (err , data)=>{
           if(err){
               console.log(err)
           }else{
               data.forEach((d)=> {
                   if(d.status == 'accepted' ||d.status == 'rejected' )
                   {
                      // console.log(d);
                      REQ_HISTORY.push(d);
                   } 
                  })
                  res.render("user/req-status" , {title : "dashboard" , name : req.user.name,REQ_HISTORY : REQ_HISTORY, layout : "./layouts/userprofileLayout"});
           }
       });
       
   
      
    });


module.exports  = router ;
