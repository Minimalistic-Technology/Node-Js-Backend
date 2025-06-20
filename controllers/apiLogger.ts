import { NextFunction, Request, Response } from "express";
import LogModel from "../models/log.models";


const apiLogger = (req:any, res:any, next:any) => {
  const startTime = Date.now(); // Start time for request processing
  // Structure to log
  const logEntry:any = {
    userId: req.user?.id || null, // Assuming user info is available in `req.user`
    method: req.method,
    endpoint: req.originalUrl,
    requestPayload: req.body || {}, // Capture request body
    responsePayload: null, // Will be filled after capturing the response
    statusCode: null, // Will be set after response
    duration: null, // Will be calculated after response
    timestamp: new Date(),
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  };

  // Wrap `res.send` to capture the response body
  const originalSend = res.send;
  res.send = function (body:any) {
    logEntry.userId = req.user?.id;
    logEntry.responsePayload = body; // Store response body
    logEntry.statusCode = res.statusCode; // Store status code
    logEntry.duration = Date.now() - startTime; // Calculate duration
    originalSend.call(this, body); // Call the original `res.send` method
  };

  // Save log entry once the response has been sent
  res.on('finish', async () => {
    try {
      queueMicrotask(async ()=>{
        LogModel.create(logEntry); // Replace with your Mongoose model
      })
    } catch (error) {
      console.error("Failed to save API log:", error);
    }
  });

  next();
};

module.exports = apiLogger;
