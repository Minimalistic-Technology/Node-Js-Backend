import mongoose from 'mongoose';
require('dotenv').config();

const dbUrl: string = process.env.MONGO_URI || '';

const connectDB = async () => {
    try {
        if (!dbUrl) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(dbUrl).then((data: any) => {
            console.log(`Database connected with ${data.connection.host}`)
        })
    } catch (error: any) {
        console.error('Database connection error:', error);
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;