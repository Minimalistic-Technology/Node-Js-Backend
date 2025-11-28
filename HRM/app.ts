require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";

export const app = express();
app.use(express.json({ limit: "50mb" }));
import cors from "cors";
import cookieParser from "cookie-parser";
import AccessControlRoutes from './routes/AccessControlRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import leaveRoutes from './routes/leaveRoutes';


require('dotenv').config();
// const apiLogger = require('./controllers/apiLogger');
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


// body parser
const bodyParser = require('body-parser');

// cookie parser
app.use(cookieParser());


app.use('/api/hrm', AccessControlRoutes);
app.use('/api/hrm', attendanceRoutes);
app.use('/api/hrm',leaveRoutes);

export default app;