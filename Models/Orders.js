const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const OrderSchema = new mongoose.Schema({
    id : {
        type : String,
        required : [true, 'Please enter experience required for this job.']
    },
    content : {
        name:String,
        note:{

        },
        qty:{
        type:Number,
        }
        
    },
    url:String,
    createdAt : {
        type : {
            day:String,
            time:String
        }
    },
    by:{
        type:String,
        require:true
    },
    
    status:{
        type:String,
        required:true,
        default:"Received"
    },
    category:{
        type:String,
        required:true,
        default:"food"
    },
    otp:{
        type:Number
    
    },
    uotp:{
        type:Number,
    
    },
    assignedTo:{
        type:Number
    }
});




module.exports = mongoose.model('Orders', OrderSchema);

