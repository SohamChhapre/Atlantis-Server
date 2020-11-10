const Orders =require('./../Models/Orders.js');
const User =require('./../Models/User.js');
const Driver=require('./../Models/Driver.js')
const Errorhandler= require('./../Utils/Errorhandler');
var {v4,v1}=require('uuid')
var bcrypt=require('bcrypt')
const SendToken=require('./../Utils/SendToken');



exports.DriverLogin=async (req,res,next)=>{
    var {username,password} = req.body;

    if(!username || !password){
      return next (new Errorhandler('Please Enter Email and Password',400))
    }
    var driver=await Driver.findOne({username});
   
    if(!driver)
     return next (new Errorhandler('Invalid Username or Password',401))
    var ismatch=await driver.ComparePassword(password)
    if(!ismatch)
     return next (new Errorhandler('Invalid Username or Password',401))

    SendToken(driver,200,res)

    
    

}

exports.ResetDriverPassword= async (req,res,next)=>{
    var {password,username}=req.body;
    Driver.findOne({username:username}).then((driver)=>{
            if(driver){
                driver.password=bcrypt.hashSync(password,10);
                driver.save();
                res.status(200).json({
                    status:true,
                    message:"Password Updated Successfully",
                    data:{
                        username,
                        password
                    }
                })
            }
            else{
                res.status(400).json({
                    status:false,
                    errMessage:"No Driver Exist with the username"
                });
            }

    })

}


exports.getnewDriver =  async(req, res, next) => {
    
    var driverCount = await Driver.countDocuments('username').exec();
    var Newdriver={"username":"driver-"+v1().slice(0,6),"password":v4().slice(0,12),"id":driverCount}
    const driver = new Driver(Newdriver);

    if (Newdriver.password) {
        driver.password = bcrypt.hashSync(Newdriver.password,10);
    }

    await driver.save();
    res.status(201).json({
        success : true,
        data : Newdriver,
        message:"Driver created Successfully"
    })

};


exports.pickOrder = async (req,res,next)=>{
                const {orderid,otp}=req.body;
                const driverid=req.driver.id;


                if(!driverid){
                    return (next(new Errorhandler("Unauthorized User",400)))
                }

                const UpdateOrder= await Orders.findOne({status:"Inprogress",id:orderid,otp:otp})
                
                if(!UpdateOrder){
                    return (next(new Errorhandler("Wrong Orderid or Otp"),400))
                }
                UpdateOrder.status="Outfordelivery";
                UpdateOrder.assignedTo=driverid;
                await UpdateOrder.save();
                res.status(200).json({
                    status:true,
                    message:"Asssinged with new order:"+orderid
                
                })
}

exports.getDriverorders = async (req,res,next)=>{

        const driverid=req.driver.id;
        const driver={id:req.driver.id,username:req.driver.username}


        console.log(req.driver)

        if(!driverid){
            return (Next(new Errorhandler("Invalid Request",400)))
        }

        var OrderAss= await Orders.find({assignedTo:driverid,status:"Outfordelivery"},{"_id":0,"otp":0,"uotp":0}).sort("createdAt")
        var OrderCompleted= await Orders.find({assignedTo:driverid,status:"Completed"},{"_id":0,"otp":0,"uotp":0}).sort("createdAt")
        console.log(OrderAss)
        var i=0;
        for(i=0;i<OrderAss.length;i++){
            var userid=OrderAss[i].by
            var usr=await User.findOne({userid:userid},{"name":1,"username":1,"location":1,"_id":0})

            OrderAss[i].user=usr;
            OrderAss[i]={content:OrderAss[i].content,status:OrderAss[i].status,category:OrderAss[i].status,id:OrderAss[i].id,createdAt:OrderAss[i].createdAt,"user":usr,url:OrderAss[i].url};

        }
        for(i=0;i<OrderCompleted.length;i++){
            var userid=OrderCompleted[i].by;
            var usr=await User.findOne({userid:userid},{"name":1,"username":1,"location":1,"_id":0})
            OrderCompleted[i]={content:OrderCompleted[i].content,status:OrderCompleted[i].status,url:OrderCompleted[i].url,category:OrderCompleted[i].status,id:OrderCompleted[i].id,createdAt:OrderCompleted[i].createdAt,"user":usr};
        }
        

        res.status(200).json({
                status:true,
                message:"Data Retrived Successfully",
                Assinged:OrderAss,
                Completed:OrderCompleted,
                driver
        })
}

exports.completedOrder= async(req,res,next )=>{

        const driverid=req.driver.id;
        const {orderid,otp}=req.body;


        if(!driverid){
            return next(new Errorhandler("Invalid Request",400));
        }

        if(!orderid || !otp){
            return next(new Errorhandler("Orderid and Otp required",400))
        }

        const UpdateOrder=await Orders.findOne({assignedTo:driverid,id:orderid,uotp:otp});

        if(!UpdateOrder){
            return next(new Errorhandler("Wrong orderid or Otp",400))
        }
        
        UpdateOrder.status="Completed";
        await UpdateOrder.save()

        res.status(200).json({
            status:true,
            message:"Order Completed Successfully"
        })

}