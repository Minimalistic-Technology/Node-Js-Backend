"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateProfilePicture = exports.updatePassword = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.enrollSpecificTag = exports.activateUser = exports.createActivationToken = exports.registrationUser = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const jwt_1 = require("../utils/jwt");
const user_service_1 = require("../services/user.service");
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_model_1 = __importDefault(require("../models/course.model"));
const crypto_1 = __importDefault(require("crypto"));
const progress_models_1 = require("../models/progress.models");
exports.registrationUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, password, phone, institute } = req.body;
        const isEmailExist = await user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email already exist", 400));
        }
        const user = {
            name,
            email: email?.toLowerCase(),
            password,
            phone,
            institute,
        };
        const activationToken = (0, exports.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail.ejs"), data);
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account!`,
                activationToken: activationToken.token,
            });
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        user,
        activationCode,
    }, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Invalid activation code", 400));
        }
        const { name, email, password, phone, institute } = newUser.user;
        const existUser = await user_model_1.default.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler_1.default("Email already exist", 400));
        }
        // const courses: any = await CourseModel.find().select("_id courseData");
        // const listOfCourseId = courses.map((course: any) => {
        //   return { _id: course._id.toString() };
        // });
        const user = await user_model_1.default.create({
            name,
            email,
            password,
            phone,
            institute,
            // courses: listOfCourseId,
        });
        // courses.map(async (course: any, index: any) => {
        //   let progress = new ProgressModal({
        //     user: user?._id?.toString(),
        //     course: course._id,
        //     completedSections: 0,
        //     totalSections: course.courseData.length,
        //     progressPercentage: 0,
        //     locked: index === 0 ? false : true,
        //   });
        //   await progress.save();
        // });
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Enroll Course For Specific Tag
exports.enrollSpecificTag = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { tag } = req.query;
        const courses = await course_model_1.default.find({ tags: tag }).sort({ _id: 1 });
        // .select(
        //   "_id courseData"
        // );
        const user = await user_model_1.default.findById(req.user?._id);
        courses.map((course) => {
            user?.courses.push({ _id: course._id.toString() });
            return { _id: course._id.toString() };
        });
        user.enrolledTags.push(tag);
        await user?.save();
        courses.map(async (course, index) => {
            let progress = new progress_models_1.ProgressModal({
                user: user?._id?.toString(),
                course: course._id,
                completedSections: 0,
                totalSections: course.courseData.length,
                progressPercentage: 0,
                locked: index === 0 ? false : true,
            });
            await progress.save();
        });
        res.status(201).json({
            success: true,
            // courses,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please enter email and password", 400));
        }
        const user = await user_model_1.default
            .findOne({ email: email?.toLowerCase() })
            .select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// logout user
exports.logoutUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        res.cookie("access_token", "1", {
            maxAge: 1,
            sameSite: "none",
            secure: true,
        });
        // res.setHeader("Set-Cookie", "access_token=0; Max-Age=1");
        // res.setHeader("Set-Cookie", "refresh_token=0; Max-Age=1");
        res.cookie("refresh_token", "1", {
            maxAge: 1,
            sameSite: "none",
            secure: true,
        });
        const userId = req.user?._id || "";
        // redis.del(userId);
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
            userId,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update access token
exports.updateAccessToken = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        const message = "Could not refresh token";
        if (!decoded) {
            return next(new ErrorHandler_1.default(message, 400));
        }
        const session = "";
        // await redis.get(decoded.id as string);
        if (!session) {
            return next(new ErrorHandler_1.default("Please login for access this resources!", 400));
        }
        const user = JSON.parse(session);
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: "5m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: "3d",
        });
        req.user = user;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        // await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7days
        return next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get user info
exports.getUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        (0, user_service_1.getUserById)(userId, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// social auth
exports.socialAuth = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, name, avatar } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            const newUser = await user_model_1.default.create({ email, name, avatar });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        else {
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, phone, institute } = req.body;
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId);
        if (name && user) {
            user.name = name;
            user.email = email?.toLowerCase();
            user.phone = phone;
            user.institute = institute;
        }
        await user?.save();
        // await redis.set(userId, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updatePassword = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler_1.default("Please enter old and new password", 400));
        }
        const user = await user_model_1.default.findById(req.user?._id).select("+password");
        if (user?.password === undefined) {
            return next(new ErrorHandler_1.default("Invalid user", 400));
        }
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid old password", 400));
        }
        user.password = newPassword;
        await user.save();
        // await redis.set(req.user?._id, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update profile picture
exports.updateProfilePicture = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId).select("+password");
        if (avatar && user) {
            // if user have one avatar then call this if
            if (user?.avatar?.public_id) {
                // first delete the old image
                await cloudinary_1.default.v2.uploader.destroy(user?.avatar?.public_id);
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            else {
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }
        await user?.save();
        // await redis.set(userId, JSON.stringify(user));
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all users --- only for admin
exports.getAllUsers = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, user_service_1.getAllUsersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update user role --- only for admin
exports.updateUserRole = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, role } = req.body;
        const isUserExist = await user_model_1.default.findOne({ email });
        if (isUserExist) {
            const id = isUserExist._id;
            (0, user_service_1.updateUserRoleService)(res, id, role);
        }
        else {
            res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Delete user --- only for admin
exports.deleteUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.default.findById(id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        await user.deleteOne({ id });
        // await redis.del(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.forgotPassword = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    const { email } = req.body;
    // Find user by email
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    // Save the user with the reset token and expiration
    await user.save({ validateBeforeSave: false });
    // Save the user with the reset token and expiration
    await user.save({ validateBeforeSave: false });
    // Create reset URL
    const resetUrl = `${req.get("origin")}/reset-password/${resetToken}&${Date.now() + 10 * 60 * 1000}`;
    // Send reset email
    const message = `Reset your password using the following link: \n\n${resetUrl}`;
    // const transporter: Transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: parseInt(process.env.SMTP_PORT || "587"),
    //   service: process.env.SMTP_SERVICE,
    //   auth: {
    //     user: process.env.SMTP_MAIL,
    //     pass: process.env.SMTP_PASSWORD,
    //   },
    // });
    // Define the email options
    // const mailOptions: any = {
    //   from: process.env.SMTP_MAIL,
    //   to: userEmail,
    //   subject: "Course Completion Certificate",
    //   text: `Dear ${userName},\n\nCongratulations on completing the course ${courseName}! Please find your certificate attached.\n\nBest regards,\nYour Course Team`,
    //   attachments: [
    //     {
    //       filename: `certificate_${userName}.pdf`,
    //       content: pdfBytes,
    //       contentType: "application/pdf",
    //     },
    //   ],
    // };
    // Send the email
    // transporter.sendMail(mailOptions, (error: any, info: any) => {
    //   if (error) {
    //     return console.log("Error occurred:", error);
    //   }
    //   res.status(200).json({
    //     success:true
    //   })
    //   return console.log("Mail Sent...");
    // }),
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: user.email,
            subject: "Password Reset",
            text: message,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log("Error occurred:", error);
            }
            res.status(200).json({
                success: true,
            });
            return console.log("Mail Sent...");
        }),
            res.status(200).json({ message: "Reset email sent" });
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500).json({ error, message: "Email could not be sent" });
    }
});
exports.resetPassword = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await user_model_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return res
            .status(400)
            .json({ message: "Token is invalid or has expired." });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successful." });
});
