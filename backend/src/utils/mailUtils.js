import nodemailer from 'nodemailer';

export const sendOTP = async (email, otp) => {
    try {
        const port = process.env.SMTP_PORT || 587;

        // If testing/demo and no SMTP credentials, we skip sending but still log
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log(`[MAIL-STUB] To: ${email}, OTP: ${otp}`);
            return true;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: port,
            secure: port == 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"SecureExamVault" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Your Verification Code - SecureExamVault",
            text: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px;">
                    <h2 style="color: #3b82f6;">SecureExamVault Verification</h2>
                    <p>You are attempting to access your account. Please use the following code to complete your Multi-Factor Authentication:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 5px; color: #1e40af; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
