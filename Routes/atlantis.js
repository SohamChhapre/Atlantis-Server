var express=require('express');
const router=express.Router()
var {getnewUser,setResettoken,ResetPassword,UpdatePassword,UserLogin} =require('../Controllers/User.js');
var {createOrder,getUserOrders,getOrdersDist,updateOrderStatus} =require('../Controllers/Orders.js')
var {ResetDriverPassword,getnewDriver,getDriverorders,pickOrder,completedOrder,DriverLogin}= require('../Controllers/Driver.js')
var {isAuthenticatedDriver,isAuthenticatedUser}=require('../Middlewere/auth.js');


router.route('/password/reset').put(setResettoken);

router.route('/password/reset/:token').put(ResetPassword);

router.route('/password').put(UpdatePassword);

router.route('/user/login').post(UserLogin);

router.route('/order').post(isAuthenticatedUser,createOrder);

router.route('/order').get(isAuthenticatedUser,getUserOrders);



//Driver Routes
router.route('/driver/login').post(DriverLogin);

router.route('/driver').get(isAuthenticatedDriver,getDriverorders);

router.route('/driver').put(isAuthenticatedDriver,pickOrder)

router.route('/driver/user').put(isAuthenticatedDriver,completedOrder);


// Distribution/Admin Routes

router.post('/user/new',getnewUser);

router.route('/driver/new').get(getnewDriver)

router.route('/dist/order').get(getOrdersDist);

router.route('/dist/order').put(updateOrderStatus);

router.route('/driver/reset/passwd').put(ResetDriverPassword);


module.exports=router;
