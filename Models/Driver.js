const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');

const DriverSchema = new mongoose.Schema({
    id : {
        type : String,
        required : [true, 'Please enter experience required for this job.']
    },
    name : {
        type : String,
        required : [false, 'Please enter Job title.'],
        maxlength : [100, 'Job title can not exceed 100 characters.']
    },
    username : {
        type : String,
        required : [true, 'Please enter Job description.'],
        maxlength : [100, 'Job description can not exceed 1000 characters.']
    },
    password : {
        type : String,
        required:[true,'']
    },
    location : {
        type : [String],
        required : [false, 'Please add an address.']
    },
    email:  { 
        type: String
    },

    resetPasswordToken: String,
    
    resetPasswordExpires: Date,
   
    gender : {
        type : String,
        required : [false, 'Please enter experience required for this job.']
    },
    dob : {
        type : String 
    },
    phoneNumber:{
        type:Number,
    },
    vehicles:{
        type:[Number]
    }
});
DriverSchema.methods.getJwtToken=function(){


    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_TOKEN_EXPIRES
    }
    )
}

DriverSchema.methods.ComparePassword= async function(password){

    return await bcrypt.compareSync(password,this.password);
}



module.exports = mongoose.model('Driver', DriverSchema);

