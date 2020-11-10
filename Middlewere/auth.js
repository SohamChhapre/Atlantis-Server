const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Driver=require('./../Models/Driver.js')

const ErrorHandler = require('../Utils/Errorhandler');


exports.isAuthenticatedUser = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401));
    }

    var decoded
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET)
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({
                status:false,
                errMessage:"Unauthorized Login First to Access this Resource"
            })
		}
        return res.status(401).json({
                status:false,
                errMessage:"Unauthorized Login First to Access this Resource"
            })
		
    }

    const user = await User.findById(decoded.id);
    req.user=user;
    
        next();
    

};



exports.isAuthenticatedDriver=async (req,res,next)=>{
     let token;
     
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log(req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token)

    if(!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401));
    }

    
    var decoded
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET)
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({
                status:false,
                errMessage:"Unauthorized Login First to Access this Resource"
            })
		}
        return res.status(401).json({
                status:false,
                errMessage:"Unauthorized Login First to Access this Resource"
            })
		
    }

    const driver = await Driver.findById(decoded.id);
    req.driver=driver;
    
        next()
    

    

}