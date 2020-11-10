const express=require('express');
const app=express();
const cors=require('cors');
const dotenv=require('dotenv');
const atlantis=require('./Routes/atlantis.js');
const ConnectDB=require('./Config/database.js');
dotenv.config({path:'./Config/config.env'});
const bodyParser = require('body-parser');
const errorMiddlewere=require('./Middlewere/error')
const ErrorHandler =require('./Utils/Errorhandler.js')
ConnectDB();

app.use(cors());

app.use(function(req, res, next) {
  res.set({
          'Content-Type': 'application/json'
        })
    next();
    });
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.json());


app.use(atlantis);


app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

app.use(errorMiddlewere);


const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log("server started");
});