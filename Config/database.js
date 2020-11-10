const mongoose=require('mongoose')

const connectDB = ()=>{ mongoose.connect(process.env.DB_LOCAL_URI,{
    useNewUrlParser: true,
    useUnifiedTopology : true,
    useCreateIndex : true
}).then(con=> {
    console.log(`mongoDB Database connected with the host: ${con.connection.host}`)
});
}

module.exports = connectDB;

