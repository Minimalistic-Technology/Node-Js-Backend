require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cookieParser = require('cookie-parser');
const goldRoutes = require('./routes/goldpriceRoutes');


const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/contact', contactRoutes);
app.use(cookieParser());
app.use('/gold', goldRoutes);


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


