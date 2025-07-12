"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = __importDefault(require("./middleware/error"));
// import userRouter from "./routes/user.routes";
// import courseRouter from "./routes/course.routes";
// import orderRouter from "./routes/order.route";
// import notificationRouter from "./routes/notification.route";
// import analyticsRouter from "./routes/analytics.route";
// import layoutRouter from "./routes/layout.route";
const express_rate_limit_1 = require("express-rate-limit");
const authRoutes_1 = __importDefault(require("./Auth/routes/authRoutes"));
// import taskRouter from "./routes/task.route";
// import { TaskModel } from "./models/task.models";
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
const mongoose_1 = __importDefault(require("mongoose"));
const productRoutes_1 = __importDefault(require("./Product/routes/productRoutes"));
const productPriceRoutes_1 = __importDefault(require("./Product/routes/productPriceRoutes"));
const projectRoutes_1 = __importDefault(require("./Project/routes/projectRoutes"));
const profileRoutes_1 = __importDefault(require("./Profile/routes/profileRoutes"));
const contactFormRoutes_1 = __importDefault(require("./Contact/routes/contactFormRoutes"));
const workoutRoutes_1 = __importDefault(require("./Fitness/routes/workoutRoutes"));
const workoutProgressRoutes_1 = __importDefault(require("./Fitness/routes/workoutProgressRoutes"));
const otpRoutes_1 = __importDefault(require("./OTP/routes/otpRoutes"));
const propertyRoutes_1 = __importDefault(require("./Property/routes/propertyRoutes"));
const bmiRoutes_1 = __importDefault(require("./Fitness/routes/bmiRoutes"));
const loginRoutes_1 = __importDefault(require("./Education/routes/loginRoutes"));
const cartRoutes_1 = __importDefault(require("./Product/routes/cartRoutes"));
const feedbackRoutes_1 = __importDefault(require("./Product/routes/feedbackRoutes"));
const examSettingRoutes_1 = __importDefault(require("./Education/routes/examSettingRoutes"));
const scheduleRoutes_1 = __importDefault(require("./Education/routes/scheduleRoutes"));
const documentRoutes_1 = __importDefault(require("./Education/routes/documentRoutes"));
const stockroutes_1 = __importDefault(require("./Stocks/routes/stockroutes"));
const doctorreview_1 = __importDefault(require("./Hospital/routes/doctorreview"));
const hospitalroutes_1 = __importDefault(require("./Hospital/routes/hospitalroutes"));
const blogRoutes_1 = __importDefault(require("./Blog/routes/blogRoutes"));
const quoteBlogRoutes_1 = __importDefault(require("./Blog/routes/quoteBlogRoutes"));
const collectionRoutes_1 = __importDefault(require("./Collection/routes/collectionRoutes"));
const contactRoutes_1 = __importDefault(require("./Contact/routes/contactRoutes"));
const courseRoutes_1 = __importDefault(require("./Course/routes/courseRoutes"));
const messageRoutes_1 = __importDefault(require("./Message/routes/messageRoutes"));
require('dotenv').config();
// const apiLogger = require('./controllers/apiLogger');
exports.app.use('/api/products', productRoutes_1.default);
exports.app.use('/api/prices', productPriceRoutes_1.default);
exports.app.use('/api', projectRoutes_1.default);
exports.app.use('/api', profileRoutes_1.default);
exports.app.use('/api', contactFormRoutes_1.default);
exports.app.use('/api', workoutRoutes_1.default);
exports.app.use('/api', workoutProgressRoutes_1.default);
exports.app.use('/api', propertyRoutes_1.default);
exports.app.use('/api', bmiRoutes_1.default);
exports.app.use('/api/hospital', hospitalroutes_1.default);
exports.app.use('/api/login', loginRoutes_1.default);
exports.app.use('/api', cartRoutes_1.default);
exports.app.use('/api', feedbackRoutes_1.default);
exports.app.use('/api', examSettingRoutes_1.default);
exports.app.use('/api/schedule', scheduleRoutes_1.default);
exports.app.use('/api/document', documentRoutes_1.default);
exports.app.use('/api/producttools', stockroutes_1.default);
exports.app.use('/api/doctorreview', doctorreview_1.default);
exports.app.use('/api/blogs', blogRoutes_1.default);
exports.app.use('/api/quotes', quoteBlogRoutes_1.default);
exports.app.use('/api/collections', collectionRoutes_1.default);
exports.app.use('/api/contact', contactRoutes_1.default);
exports.app.use('/api/courses', courseRoutes_1.default);
exports.app.use('/api/messages', messageRoutes_1.default);
// body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
const bodyParser = require('body-parser');
// cookie parser
exports.app.use((0, cookie_parser_1.default)());
exports.app.use('/api/otp', otpRoutes_1.default);
// cors => cross origin resource sharing
exports.app.use((0, cors_1.default)({
    // make sure you don't have / in last 
    // Do "http://localhost:3000"
    // Don't "http://localhost:3000/"
    origin: ["http://localhost:3000"],
    credentials: true,
}));
// api requests limit
// const limiter = rateLimit({
//   windowMs: 5 * 60 * 1000,
// 	max: 100, 
// 	standardHeaders: 'draft-7', 
// 	legacyHeaders: false, 
// })
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60000, // 1 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: function (req, res, next) {
        setTimeout(() => {
            next();
        }, 5000); // 5-second delay for requests over the limit
    }
});
// middleware calls
exports.app.use(limiter);
// app.use(apiLogger)
// routes
const ml = "";
const mt = "";
const mc = "";
const ms = "";
const mml = "";
const mp = "";
const mn = "";
exports.app.use("/api/v1/auth", authRoutes_1.default);
// testing api
exports.app.get("/test", async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "GET API is working",
    });
});
exports.app.get("/test-db", async (req, res) => {
    try {
        await mongoose_1.default.connection.db.admin().ping();
        res.status(200).json({ message: "MongoDB is connected" });
    }
    catch (err) {
        res.status(500).json({ error: "MongoDB connection failed", details: err });
    }
});
if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
exports.app.post("/order", async (req, res, next) => {
    try {
        const instance = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY + "",
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto_1.default.randomBytes(10).toString("hex")
        };
        instance.orders.create(options, (error, order) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Something Went Wrong!",
                    error: error
                });
            }
            res.status(200).json({ data: order });
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            err
        });
    }
});
exports.app.post("/verify", async (req, res, next) => {
    try {
        const { razorPay_order_id, razorPay_payment_id, razorPay_signature } = req.body;
        const sign = razorPay_order_id + "|" + razorPay_payment_id;
        // @ts-ignore
        const expectedSign = crypto_1.default.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");
        if (razorPay_signature === expectedSign) {
            return res.status(200).json({ success: true, message: "Payment Verify Successfully!" });
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid Signature !" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something Went Wrong!",
            error
        });
    }
});
// unknown route
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(error_1.default);
