require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";

export const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error";
// import userRouter from "./routes/user.routes";
// import courseRouter from "./routes/course.routes";
// import orderRouter from "./routes/order.route";
// import notificationRouter from "./routes/notification.route";
// import analyticsRouter from "./routes/analytics.route";
// import layoutRouter from "./routes/layout.route";
import { rateLimit } from 'express-rate-limit'
import authRoutes from './Auth/routes/authRoutes';
// import CouponCodeModel from "./models/coupon.models";
// import { couponRouter } from "./routes/coupon.router";
// import { maintenanceRouter } from "./routes/maintenance.route";
// import certificateRouter from "./routes/certificatePdf.router";
// import quizRouter from "./routes/quiz.route";
// import progressRouter from "./routes/progress.router";
import AWS from 'aws-sdk'
// import taskRouter from "./routes/task.route";
// import { TaskModel } from "./models/task.models";
import crypto from 'crypto'
import Razorpay from 'razorpay'
import mongoose from 'mongoose'
import productRoutes from './E-Commerce/routes/productRoutes';
import productPriceRoutes from './E-Commerce/routes/productPriceRoutes';
import projectRoutes from './Project/routes/projectRoutes';
import profileRoutes from './Profile/routes/profileRoutes';
import contactFormRoutes from './Contact/routes/contactFormRoutes';
import workoutRoutes from './Fitness/routes/workoutRoutes';
import workoutProgressRoutes from './Fitness/routes/workoutProgressRoutes';
import otpRouter from './OTP/routes/otpRoutes';
import propertyRoutes from './Property/routes/propertyRoutes';
import bmiRoutes from './Fitness/routes/bmiRoutes';
import login from './Education/routes/loginRoutes';
import cartRoutes from './E-Commerce/routes/cartRoutes';
import feedbackRoutes from './E-Commerce/routes/feedbackRoutes';
import examSettingRoutes from './Education/routes/examSettingRoutes';
import schedule from './Education/routes/scheduleRoutes';
import document from './Education/routes/documentRoutes';
import productToolRoutes from './Stocks/routes/stockroutes';
import doctorreview from './Hospital/routes/doctorreview';
import hospitalroutes from './Hospital/routes/hospitalroutes';
import blogRoutes from './Blog/routes/blogRoutes';
import quoteBlogRoutes from './Blog/routes/quoteBlogRoutes';
import collectionRoutes from './Collection/routes/collectionRoutes';
import contactRoutes from './Contact/routes/contactRoutes';
import courseRoutes from './Course/routes/courseRoutes';
import messageRoutes from './Message/routes/messageRoutes';
import imageRoutes from './Fitness/routes/imageRoutes';
import templateRoutes from './Template/routes/templateRoutes';
import taskRoutes from './CRM/routes/taskRoutes';
import campaignRoutes from './CRM/routes/campaignRoutes'; 
import favoriteRoutes from './E-Commerce/routes/favoriteRoutes';
import checkoutRoutes from './E-Commerce/routes/checkoutRoutes';
import paymentRoutes from './E-Commerce/routes/paymentRoutes';
import navigationCategoryRoutes from './Clothing/routes/navigationcategoryRoutes';
import AgarbattiproductRoutes from './Agarbatti Products/routes/AgarbattiproductRoutes';
import crmcontactRoutes from './CRM/routes/crmcontactRoutes';

require('dotenv').config();
// const apiLogger = require('./controllers/apiLogger');

app.use('/api/products', productRoutes);
app.use('/api/prices', productPriceRoutes);
app.use('/api', projectRoutes);
app.use('/api', profileRoutes);
app.use('/api', contactFormRoutes);
app.use('/api', workoutRoutes);
app.use('/api', workoutProgressRoutes);
app.use('/api', propertyRoutes);
app.use('/api', bmiRoutes);
app.use('/api/hospital', hospitalroutes);
app.use('/api', login);
app.use('/api', cartRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', examSettingRoutes);
app.use('/api', schedule);
app.use('/api', document);
app.use('/api/producttools', productToolRoutes);
app.use('/api/doctorreview', doctorreview);
app.use('/api/blogs', blogRoutes);
app.use('/api/quotes', quoteBlogRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api', contactRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', messageRoutes);
app.use('/api', imageRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api', favoriteRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', paymentRoutes);
app.use('/api/navigation', navigationCategoryRoutes);
app.use('/api/agarbatti', AgarbattiproductRoutes);
app.use('/api', crmcontactRoutes);

// body parser
const bodyParser = require('body-parser');

// cookie parser
app.use(cookieParser());

app.use('/api/otp', otpRouter);

// cors => cross origin resource sharing
app.use(
  cors({
    
    // make sure you don't have / in last 
    // Do "http://localhost:3000"
    // Don't "http://localhost:3000/"

    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// api requests limit
// const limiter = rateLimit({
//   windowMs: 5 * 60 * 1000,
// 	max: 100, 
// 	standardHeaders: 'draft-7', 
// 	legacyHeaders: false, 
// })

const limiter = rateLimit({
  windowMs: 60000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, 
  legacyHeaders: false,
  handler: function (req, res, next) {
      setTimeout(() => {
        next();
      }, 5000); // 5-second delay for requests over the limit
  }
})

// middleware calls
app.use(limiter);
// app.use(apiLogger)
// routes

const ml = ""
const mt = ""
const mc = ""
const ms = ""
const mml = ""
const mp = ""
const mn = ""

app.use(
  "/api/v1/auth", authRoutes,
  // userRouter,
  // orderRouter,
  // courseRouter,
  // notificationRouter,
  // analyticsRouter,
  // layoutRouter,
  // couponRouter,
  // maintenanceRouter,
  // certificateRouter,
  // quizRouter,
  // progressRouter,
  // taskRouter,
);

// testing api
app.get("/test", async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "GET API is working",
  });
});
app.get("/test-db", async (req: Request, res: Response) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ message: "MongoDB is connected" });
  } catch (err) {
    res.status(500).json({ error: "MongoDB connection failed", details: err });
  }
});
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables');
}
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
app.post("/order", async (req: Request, res: Response, next: NextFunction) => {
  try{

    const instance = new Razorpay({
      key_id : process.env.RAZORPAY_KEY+"" ,
      key_secret : process.env.RAZORPAY_KEY_SECRET
    })

    const options = {
       amount : req.body.amount * 100,
       currency : "INR",
       receipt  : crypto.randomBytes(10).toString("hex")
    }

    instance.orders.create(options, (error, order) => {
      if(error){
        return res.status(500).json({
          success:false,
          message : "Something Went Wrong!",
          error : error
        })
      }

      res.status(200).json({ data: order })

    })

  }
  catch(err){
    res.status(500).json({
      success: false,
      err
    });
  }
})

app.post("/verify", async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { razorPay_order_id, razorPay_payment_id, razorPay_signature } = req.body

    const sign = razorPay_order_id + "|" + razorPay_payment_id
    // @ts-ignore
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ).update(sign.toString()).digest("hex")
    
    if( razorPay_signature === expectedSign ){
      return res.status(200).json({ success :true, message:"Payment Verify Successfully!" })
    }else{
       res.status(400).json({ success :false, message:"Invalid Signature !" })
    }
  }
  catch(error){
    console.log(error);
    res.status(500).json({
      success : false,
      message : "Something Went Wrong!",
      error
    })
  }
})

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});


app.use(errorMiddleware);