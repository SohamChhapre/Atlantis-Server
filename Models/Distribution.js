const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');

const DistributionSchema = new mongoose.Schema({
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
    email:  { 
        type: String
    },

    resetPasswordToken: String,
    
    resetPasswordExpires: Date,
   
    phoneNumber:{
        type:Number,
    }

});

DistributionSchema.methods.getJwtToken=function(){


    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_TOKEN_EXPIRES
    }
    )
}

DistributionSchema.methods.ComparePassword= async function(password){

    return await bcrypt.compareSync(password,this.password);
}


module.exports = mongoose.model('Distribution', DistributionSchema);

