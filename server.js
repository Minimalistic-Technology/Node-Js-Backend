require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cookieParser = require('cookie-parser');
const goldRoutes = require('./routes/goldpriceRoutes');
const blogRoutes = require('./routes/blogRoutes');
const quoteRoutes = require('./routes/quoteBlogRoutes');
const otpRoutes = require('./routes/otpRoutes');
const cron = require('node-cron');
const messageRoutes = require('./routes/messageRoutes');
const { messageLog } = require('./controllers/messageController');
const stockRoutes = require('./routes/stockRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const productToolRoutes = require('./routes/stocks/productToolRoutes');
const topStockRoutes = require('./routes/topStockRoutes');
const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/contact', contactRoutes);
app.use(cookieParser());
app.use('/gold', goldRoutes);
app.use('/blogs', blogRoutes);
app.use('/quotes', quoteRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api', messageRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/stocks/producttools', productToolRoutes);
app.use('/api/topstocks', topStockRoutes);



app.get('/hello', (req, res) => {
    res.json({message: 'Hello World!'});
});

const MONGO_URI = process.env.MONGO_URI;
console.log("Connecting to:", process.env.MONGO_URI);

mongoose.connect(MONGO_URI, {
    dbName: "goldData" 
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

cron.schedule('0 * * * *', () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const beforeLength = messageLog.length;
    while (messageLog.length && now - messageLog[0].timestamp > oneDay) {
        messageLog.shift();
    }
    console.log(`Cleaned old messages. Remaining: ${messageLog.length}/${beforeLength}`);
});

