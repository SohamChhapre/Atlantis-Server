const Orders =require('./../Models/Orders.js');
const User =require('./../Models/User.js');
const Errorhandler= require('./../Utils/Errorhandler');


exports.updateOrderStatus=async (req,res,next)=>{

        var {orderid,status}=req.body
        

        const UpdateOrder = await Orders.findOne({id:orderid})
        if( UpdateOrder ){
            UpdateOrder.status=status;
            await UpdateOrder.save()
        }
        else{
            res.status(400).json({
                status:false,
                errMessage:"Invalid Request"
            })
        }

        res.status(200).json({
            status:true,
            message:"Order Updated Successfully"
        })

}



exports.getOrdersDist= async (req,res,next)=>{


        var i=0
        var UpcomingwithUser=[]
        var OutfordeliverywithUser=[]
        var InprogresswithUser=[]
        var CompletedwithUser=[]
        
        var uniqueid =  await Orders.find().distinct("by",{status:"Received"})        
        console.log( await Orders.find().distinct("by",{status:"Received"}))
        const Upcoming = await Orders.find({status: "Received"},{'_id':0,"__v":0,"otp":0}).sort({"createdAt":1,"by":1});
         
        for (i=0;i<uniqueid.length;i++){
            var id=uniqueid[i]
            const usr= await User.findOne({userid:id},{"_id":0,"__v":0,"password":0,"location":0})
            UpcomingwithUser.push({user:usr,orders:Upcoming.filter((e)=>(e.by===usr.userid))})
        }

        
        var uniqueid =  await Orders.find().distinct("by",{status:"Inprogress"})        
        const Inprogress = await Orders.find({status:"Inprogress" },{'_id':0,"__v":0})
        for (i=0;i<uniqueid.length;i++){
            var id=uniqueid[i]
            const usr= await User.findOne({userid:id},{"_id":0,"__v":0,"password":0,"location":0})
            InprogresswithUser.push({user:usr,orders:Inprogress.filter((e)=>(e.by===usr.userid))})
        }

        var uniqueid =  await Orders.find().distinct("by",{status:"Outfordelivery"})        
        
        const OutForDelivery=await Orders.find({status:"Outfordelivery"},{'_id':0,'__v':0,'otp':0})
        for (i=0;i<uniqueid.length;i++){
            var id=uniqueid[i]
            const usr= await User.findOne({userid:id},{"_id":0,"__v":0,"password":0,"location":0})
            OutfordeliverywithUser.push({user:usr,orders:OutForDelivery.filter((e)=>(e.by===usr.userid))})
        }


        var uniqueid =  await Orders.find().distinct("by",{$or:[{status:"Completed"},{status:"Cancelled"}]})        


        const Completed_Cancel=await Orders.find({$or:[{status:"Completed"},{status:"Cancelled"}]},{'_id':0,'__v':0,'otp':0})
        for (i=0;i<uniqueid.length;i++){
            var id=uniqueid[i]
            const usr= await User.findOne({userid:id},{"_id":0,"__v":0,"password":0,"location":0})
            CompletedwithUser.push({user:usr,orders:Completed_Cancel.filter((e)=>(e.by===usr.userid))})
        }



        res.status(200).json(
            {
                status:true,
                Upcoming:UpcomingwithUser,
                Inprogress:InprogresswithUser,
                Outfordelivery:OutfordeliverywithUser,
                Completed:CompletedwithUser,

            }
        )
}

// body={
//     food:[{
//         name:String,
//         qty:Number,
//         comment:String
//         }],
//     laundary:[{
//         name:String,
//         qty:Number,
//         comment:String
//         }],
//     service:[{
//         name:String,
//         qty:Number,
//         comment:String
//         }
//     ]
// }

exports.createOrder = async (req,res,next)=>{
        const userid=req.user.userid;
        const {food,laundary,service}=req.body;
        var newOrder=[]; 
        var idcount = await Orders.countDocuments('id').exec() + 1000;
        var today = new Date(Date.now())
        var tomorrow = new Date(today);
        
        tomorrow.setDate(today.getDate()+1);
        today=today.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
        tomorrow=tomorrow.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }).split(",")
        for(var i=0;i<food.length;i++)
            {
               
                if(food[i].daytime)
                {
                   var newday;
                    if(food[i].daytime.day=="today")
                        newday=today.split(",")[0]
                    else
                        newday=tomorrow[0]

                    var createdAt={
                            day:newday,
                            time:food[i].daytime.time
                        }
                    
                }
                else
                    var createdAt={
                        day:today.split(",")[0],
                        time:today.split(",")[1]
                    }
                var content={
                    name:food[i].name,
                    qty:food[i].items,
                    note:food[i].note
                }
                newOrder.push({id:idcount,by:userid,category:"food",otp:Math.trunc(1000+Math.random()*9000),content:content,uotp:Math.trunc(1000+Math.random()*9000),createdAt:createdAt,url:food[i].url})
                idcount=idcount+1
            }
        for(var i=0;i<laundary.length;i++)
             {
               
                if(laundary[i].daytime)
                {
                   var newday;
                    if(laundary[i].daytime.day=="today")
                        newday=today.split(",")[0]
                    else
                        newday=tomorrow[0]

                    var createdAt={
                            day:newday,
                            time:laundary[i].daytime.time
                        }
                    
                }
                else
                    var createdAt={
                        day:today.split(",")[0],
                        time:today.split(",")[1]
                    }
                var content={
                    name:laundary[i].name,
                    qty:laundary[i].items,
                    note:laundary[i].note
                }
                newOrder.push({id:idcount,by:userid,category:"laundry",otp:Math.trunc(1000+Math.random()*9000),content:content,uotp:Math.trunc(1000+Math.random()*9000),createdAt:createdAt,url:laundary[i].url})
                idcount=idcount+1
            }
        for(var i=0;i<service.length;i++)
             {
               
                if(service[i].daytime)
                {
                   var newday;
                    if(service[i].daytime.day=="today")
                        newday=today.split(",")[0]
                    else
                        newday=tomorrow[0]

                    var createdAt={
                            day:newday,
                            time:service[i].daytime.time
                        }
                    
                }
                else
                    var createdAt={
                        day:today.split(",")[0],
                        time:today.split(",")[1]
                    }
                var content={
                    name:service[i].name,
                    
                    note:service[i].note
                }
                newOrder.push({id:idcount,by:userid,category:"service",otp:Math.trunc(1000+Math.random()*9000),content:content,uotp:Math.trunc(1000+Math.random()*9000),createdAt:createdAt,url:service[i].url})
                idcount=idcount+1
            }

        await Orders.insertMany(newOrder);
        console.log(newOrder)
        res.status(201).json({
            status:true,
            message:"Order Placed Successfully",
            
        })


}


exports.getUserOrders=async (req,res,next)=>{

           var id=req.user.userid;
           if(id){
               var isusr=await User.countDocuments({userid:id})
                 if(isusr!==1)
                    return next( new Errorhandler("Requested User does not exists",400))
           }

           const Upcoming = await Orders.find({ by:id , $or: [ { status: "Received"},{status:"Inprogress"},{status:"OutForDelivery"} ]},{'_id':0,"__v":0});
           const Completed = await Orders.find({ by:id,status:"Completed" },{'_id':0,"__v":0,"otp":0})
           console.log(Upcoming)
          res.status(200).json(
              {
                  status:true,
                  Upcoming,
                  Completed
              }
          )



}