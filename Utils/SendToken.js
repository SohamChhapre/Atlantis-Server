const SendToken=(user,statusCode,res)=>{
        console.log(user,"here is user")
        var data={...user}
        var token=user.getJwtToken();
        const options={
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000 ),
            httpOnly:true
        }

    data=data._doc;
    data.password=0
    data._id=0
    console.log(data,"data");
    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success:true,
        message:"login Successfull",
        data:data  
    ,
    token
    }
        )   
}

module.exports=SendToken;