const mongoose = require('mongoose');
require('dotenv').config();

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'goldData',
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    setTimeout(connectDB, 5000); 
  }
};

module.exports = connectDB;
