const express = require("express");
const router = express.Router();
const BloodAvailable= require("../models/BloodAvailable");
const BloodRequest = require("../models/BloodRequest");
const BloodDonateDB = require("../models/BloodDonateDB");

let A_pos = 0, B_pos = 0, O_pos = 0, AB_pos = 0, A_neg = 0, B_neg = 0, O_neg = 0, AB_neg = 0;
function BLOOD_STOCK () {
    BloodAvailable.find((err, blood) => {
        if (err) {
            console.log(err);
        }
        else {
            blood.forEach((b) => {
                if (b.blood_group == "A+") A_pos = b.blood_unit;
                if (b.blood_group == "B+") B_pos = b.blood_unit;
                if (b.blood_group == "O+") O_pos = b.blood_unit;
                if (b.blood_group == "AB+") AB_pos = b.blood_unit;
  
                if (b.blood_group == "A-") A_neg = b.blood_unit;
                if (b.blood_group == "B-") B_neg = b.blood_unit;
                if (b.blood_group == "O-") O_neg = b.blood_unit;
                if (b.blood_group == "AB-") AB_neg = b.blood_unit;
  
            }) }});

};

router.get("/Admin-dashboard" ,   (req , res)=>{

  
    BLOOD_STOCK();
   
          res.render("admin/dashboard", {title : "Admin-Dashboard" , 
          grp_A_pos: A_pos,
          grp_B_pos: B_pos,
          grp_O_pos: O_pos,
          grp_AB_pos: AB_pos,
          grp_A_neg: A_neg,
          grp_B_neg: B_neg,
          grp_O_neg: O_neg,
          grp_AB_neg: AB_neg,
          layout  : "./layouts/adminLayout"
      })  
  });

router.post("/Admin-dashboard",(req, res)=>{
    const admin_pass = "Admin@94420";
    if(req.body.password === admin_pass)
    {
        res.redirect("/admin/Admin-dashboard");
    }else{
        res.send(" <h1 >Wrong password <h1> ") 
    }
  
})




router.get("/blood_REQ" , (req , res)=>{
  
    let REQ_RECORD = [];

      
        BloodRequest.find((error, data) => {
            if (error) {
                console.log(error)
            } else {
                // console.log(data)
                data.forEach((d) => {
                    if (d.status == 'pending') {
                        var obj = {
                           ID : d._id,
                           data: d
                        } 

                        REQ_RECORD.push(obj);

                    }  
                    BLOOD_STOCK();  
                })
              
                res.render("admin/record" , {title : "Blood Request" ,  grp_A_pos: A_pos,
                grp_B_pos: B_pos,
                grp_O_pos: O_pos,
                grp_AB_pos: AB_pos,
                grp_A_neg: A_neg,
                grp_B_neg: B_neg,
                grp_O_neg: O_neg,
                grp_AB_neg: AB_neg,
           
                REQ_RECORD : REQ_RECORD ,   layout : "./layouts/adminLayout" })
            }
    
        });

})


router.get("/blood_REQ_ACCEPT" , (req , res)=>{
  
      let REQ_RECORD = [];
      console.log(req.query.id)
      const U_id = req.query.id;
      let obj = []; 
   
      
    BloodRequest.findById(U_id).then(u=>{
        if(u){
          //   console.log(u);
            obj[0] = u.blood_group;
            obj[1] = u.blood_unit;
            console.log(obj);
            BloodAvailable.updateOne(
              { "blood_group": obj[0] }, // Filter
              { $inc: { "blood_unit" : -obj[1] } }, // Update
      
      
          )
              .then((obj) => {
                  console.log('Updated - ');
                  BloodRequest.updateOne(
                    { "_id": U_id }, // Filter
                    { $set: { "status": 'accepted' } } // Update
                   
                )
                    .then((u) => {
                        console.log('Updated - ');
                        res.redirect('/admin/blood_REQ');
                    })
                    .catch((err) => {
                        console.log(' 1 Error: ' + err);
                    })
              })
              .catch((err) => {
                  console.log('Error: ' + err);
              })
        }
      }).catch(error=>console.log(error));
   
    });
      

    
router.get('/blood_REQ_REJECT', (req, res) => {

    console.log(req.query.id)
    const U_id = req.query.id;
    //    BloodRequest.updateOne({email : U_email} , { $set :{status : 'accepted'} });

    BloodRequest.updateOne(
        { "_id": U_id }, // Filter
        { $set: { "status": 'rejected' } }, // Update


    )
        .then((obj) => {
            console.log('Updated - ');
            res.redirect('/admin/blood_REQ')
        })
        .catch((err) => {
            console.log('Error: ' + err);
        })
});



// Donate Request for admin 

router.get("/blood_DONATE" , (req , res)=>{
  
    let REQ_RECORD = [];
   
      
        BloodDonateDB.find((error, data) => {
            if (error) {
                console.log(error)
            } else {
                // console.log(data)
                data.forEach((d) => {
                    if (d.status == 'pending') {
                        var obj = {
                           ID : d._id,
                           data: d
                        } 

                        REQ_RECORD.push(obj);

                    }  
                    BLOOD_STOCK();  
                })
              
                res.render("admin/record" , {title : "Blood Request" ,  grp_A_pos: A_pos,
                grp_B_pos: B_pos,
                grp_O_pos: O_pos,
                grp_AB_pos: AB_pos,
                grp_A_neg: A_neg,
                grp_B_neg: B_neg,
                grp_O_neg: O_neg,
                grp_AB_neg: AB_neg,
            
                REQ_RECORD_D : REQ_RECORD ,   layout : "./layouts/adminLayout" })
            }
    
        });

})

router.get("/blood_DONATE_ACCEPT" , (req , res)=>{
  
    let REQ_RECORD = [];
    console.log(req.query.id)
    const U_id = req.query.id;
    let obj = []; 
 
    
    BloodDonateDB.findById(U_id).then(u=>{
      if(u){
        //   console.log(u);
          obj[0] = u.blood_group;
          obj[1] = u.blood_unit;
          console.log(obj);
          BloodAvailable.updateOne(
            { "blood_group": obj[0] }, // Filter
            { $inc: { "blood_unit" : obj[1] } }, // Update
    
    
        )
            .then((u) => {
                console.log('Updated - ');
                BloodDonateDB.updateOne(
                  { "_id": U_id }, // Filter
                  { $set: { "status": 'accepted' } } // Update
                 
              )
                  .then((u) => {
                      console.log('Updated - ');
                      res.redirect('/admin/blood_DONATE');
                  })
                  .catch((err) => {
                      console.log(' 1 Error: ' + err);
                  })
            })
            .catch((err) => {
                console.log('Error: ' + err);
            })
      }
    }).catch(error=>console.log(error));
 
  });
    

  
router.get('/blood_DONATE_REJECT', (req, res) => {

  console.log(req.query.id)
  const U_id = req.query.id;
  //    BloodRequest.updateOne({email : U_email} , { $set :{status : 'accepted'} });

  BloodDonateDB.updateOne(
      { "_id": U_id }, // Filter
      { $set: { "status": 'rejected' } }, // Update


  )
      .then((obj) => {
          console.log('Updated - ');
          res.redirect('/admin/blood_DONATE')
      })
      .catch((err) => {
          console.log('Error: ' + err);
      })
});

router.get("/exit" , (req , res)=>{
    res.redirect("/");
});




module.exports = router ;
