var User = require('../Models/User');
var {v4,v1}=require('uuid')
var bcrypt=require('bcrypt')
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
var nodemailer=require('nodemailer');
const Errorhandler= require('./../Utils/Errorhandler');
const SendToken=require('./../Utils/SendToken');




var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '1899sohamchhapre@gmail.com',
  
    pass:'Abc@1234',
  }
});




exports.getnewUser =  async(req, res, next) => {
    var {firstname,lastname,location,phone,email}=req.body;
    var userCount = await User.countDocuments('username').exec();;
    var Newuser={"username":"user-"+v1().slice(0,6),"password":v4().slice(0,12),"userid":userCount,name:{firstname:firstname,lastname:lastname},phone:phone,location:location,email:email}
    const user = new User(Newuser);

    if (Newuser.password) {
        user.password = bcrypt.hashSync(Newuser.password,10);
    }

    await user.save();
    res.status(201).json({
        success : true,
        data : Newuser,
        message:"User created Successfully"
    })

};

exports.setResettoken =   async (req, res, next) => {
    console.log(req.body)
    var token=crypto.randomBytes(20).toString('hex');
    console.log("above user")
    User.findOne({ email: req.body.email }) 
    .then((user) => {
       if (user) {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;
            user.save();
            console.log("User upadted")
       } else {

         return next(new Errorhandler("No account with Email exist",400))
         console.log("user failed")
       }
    })
  var mailOptions = {
  from: '1899sohamchhapre@gmail.com',
  to: req.body.email,
  subject: 'Password Reset Atlantis',
  text: 'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + "192.168.43.168:3000" + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.status(400).json({
        status:false,
        errMessage:"Problem in sending mail try again"
    })
    console.log("mail error",error)
  }
   else {
    res.status(200).json({
        status:true,
        message:"Reset Link Send to the Email"
    })
  }
}); 

};
exports.UpdatePassword= async (req,res,next)=>{
    var {old_password,new_password,username}=req.body;
    User.findOne({username:username}).then((user)=>{
            if(user){
            var oldpassword=user.password;
            if(bcrypt.compareSync(old_password,oldpassword)){
                user.password=bcrypt.hashSync(new_password,10);
                user.save();
                res.status(200).json({
                    status:true,
                    message:"Password Updated Successfully"
                })
            }
            else{
                res.status(400).json({
                    status:false,
                    errMessage:"Incorrect Password"
                });
            }
            }
            else{
                res.status(400).json({
                    status:false,
                    errMessage:"Something went wrong"
                })
            }

    })

}
exports.ResetPassword = async (req, res, next) => {
     console.log(req.body,req.params)
    var token=req.params.token
    console.log("above user")
    var resetPasswordToken =token;
     
     const user = await User.findOne({ 
        resetPasswordToken:token,
        resetPasswordExpires: {$gte : Date.now()
         }
    })
        console.log(user)
        var Toemail;

       if (user) {
            user.password=bcrypt.hashSync(req.body.password,10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            Toemail=user.email;
            user.save();
            console.log("User upadted")
       } else {
          console.log("user failed")
         return next(new Errorhandler("Wrong or Expired URL",401))
         
        
       }
  
    
    
 
    
  var mailOptions = {
  from: '1899sohamchhapre@gmail.com',
  to:Toemail ,
  subject: 'Password Change Successfully',
  text: 'Password change Successfully'
    };

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.status(200).json({
        status:true,
        message:"Password Changed Successfully"
    })
    console.log("mail error",error)
  }
   else {
    res.status(200).json({
        status:true,
        message:"Password Changed Successfully "
    })
  }
}); 

};

exports.UserLogin=async (req,res,next)=>{
    var {username,password}=req.body;

    if(!username || !password){
      return next (new Errorhandler('Please Enter Email and Password',400))
    }
    var usr=await User.findOne({username});
    console.log(usr);
    if(!usr)
     return next (new Errorhandler('Invalid Username or Password',400))
    var ismatch=await usr.ComparePassword(password)
    if(!ismatch)
     return next (new Errorhandler('Invalid Username or Password',400))

    SendToken(usr,200,res);

    // var token=usr.getJwtToken();

    // res.status(200).json({
    //   status:true,
    //   message:"Login in Successfull",
    //   token
    // })
    

}
