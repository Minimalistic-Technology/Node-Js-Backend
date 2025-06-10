import { Request, Response } from "express";
import sendMail from "../utils/sendMail";
import generateOtp from "../utils/generateOTP";

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ message: "Name and email are required" });
    return;
  }

  const otp = generateOtp();

  try {
    await sendMail({
      email,
      subject: "Your OTP Code",
      template: "otp-template.ejs", // Make sure this file exists
      data: { name, otp },
    });

    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};
