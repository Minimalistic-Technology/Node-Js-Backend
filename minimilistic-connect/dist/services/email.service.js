"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
exports.emailService = {
    sendVerificationEmail: async (email, token) => {
        // This is a stub. Implement actual email sending with Nodemailer here.
        console.log(`Sending verification email to ${email} with token: ${token}`);
    },
};
