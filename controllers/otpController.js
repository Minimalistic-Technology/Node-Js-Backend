const sendEmail = require('../utils/sendMail');
const generateOtp = require('../utils/generateOTP');

const sendOtp = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) return res.status(400).json({ message: "Name and email are required" });

    const otp = generateOtp();
    
    try {
        await sendEmail(name, email, otp, "Your OTP Code");
        return res.status(200).json({ message: "OTP sent successfully", otp }); 
    } catch (error) {
        return res.status(500).json({ message: "Failed to send OTP", error });
    }
};

module.exports = { sendOtp };
