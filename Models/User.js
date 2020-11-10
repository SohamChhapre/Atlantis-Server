const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt')
const UserSchema = new mongoose.Schema({
    userid : {
        type : String,
        required : [true, 'Please enter experience required for this job.']
    },
    name : {
        type : {
            firstname:String,
            lastname:String
        },
        required : [false, 'Please enter Job title.'],
        
    },
    username : {
        type : String,
        required : [true, 'Please enter Job description.'],
    },
    password : {
        type : String,
        required:[true,'']
    },
    location : {
        type : String,
        required : [false, 'Please add an address.']
    },
    email:  { 
        type: String
    },
    phone:{
        type:Number,
        require:true
    },

    resetPasswordToken: String,
    
    resetPasswordExpires: Date,
   
    gender : {
        type : String,
        required : [false, 'Please enter experience required for this job.']
    },
    dob : {
        type : String 
    }
  
});

UserSchema.methods.getJwtToken=function(){


    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_TOKEN_EXPIRES
    }
    )
}
UserSchema.methods.ComparePassword= async function(password){

    return await bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User', UserSchema);
