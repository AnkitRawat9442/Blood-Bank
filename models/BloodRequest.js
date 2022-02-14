const mongoose = require('mongoose');
 
const BloodRequestSchema  = new mongoose.Schema({
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

const BloodRequest = mongoose.model('BloodRequest', BloodRequestSchema);

module.exports = BloodRequest;
