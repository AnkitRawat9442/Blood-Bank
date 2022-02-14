const mongoose = require('mongoose');
 
const BloodDonateSchema  = new mongoose.Schema({
    name : {
        type : String ,
        required : true,   
    },
    email : {
        type : String ,
        required : true,   
    },
    password : {
        type : String ,
        required : true,   
    },
    blood_group : {
        type :String,
        required :true,
    },
    blood_unit : {
        type :Number,
        required :true,
    },
     status : {
        type : String,
        required :true,
        },

    date : {
        type : Date ,
       default : Date.now,
    }

});

const BloodDonateDB = mongoose.model('BloodDonate', BloodDonateSchema);

module.exports = BloodDonateDB;