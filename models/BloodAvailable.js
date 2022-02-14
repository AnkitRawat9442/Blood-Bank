const mongoose = require('mongoose');
 
const BloodAvailableSchema  = new mongoose.Schema({
  
    blood_group : {
        type :String,
        required :true,
    },
    blood_unit : {
        type :Number,
        required :true,
    },
    

});

const BloodAvailable = mongoose.model('BloodAvailable', BloodAvailableSchema);




module.exports = BloodAvailable;
