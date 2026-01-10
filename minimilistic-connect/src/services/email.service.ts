export const emailService = {
  sendVerificationEmail: async (email: string, token: string) => {
    // This is a stub. Implement actual email sending with Nodemailer here.
    console.log(`Sending verification email to ${email} with token: ${token}`);
  },
};

