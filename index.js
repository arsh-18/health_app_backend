import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js"
import userRoute from "./Routes/user.js"
import doctorRoute from './Routes/doctor.js'
import reviewRoute from './Routes/review.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;



// app.use(cors({
//     origin: 'http://localhost:5000',
//     // credentials: true, // You might need this if you're using cookies or sessions
//   }));
  
app.use(express.json());
const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

app.get("/" , (req,res)=>{
    res.send("API is working");
})

//database connection
mongoose.set('strictQuery',false);  // Done to prevent warning in console
// this connectDB function will be called in app.listen
const connectDB = async()=>{
    try{    
        mongoose.connect(process.env.MONGO_URL,{
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
            // ssl: true,
            // sslValidate: true,
        })
        console.log("MongoDB database is connected")
    } catch (err){
        console.log("MongoDB database is connection failed")
    }
}

//middleware
// app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions));
app.use (bodyParser.json ({extended: true}));
app.use (bodyParser.urlencoded({extended: true}));

app.use(cors(corsOptions))
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/users',userRoute)
app.use('/api/v1/doctors',doctorRoute)
app.use('/api/v1/reviews',reviewRoute)




app.listen(port , ()=>{
    connectDB();
    console.log("Server is running on port " + port)
})