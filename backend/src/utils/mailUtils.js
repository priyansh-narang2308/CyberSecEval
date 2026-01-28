import nodemailer from 'nodemailer';

export const sendOTP = async (email, otp) => {
    try {
        const port = process.env.SMTP_PORT || 587;

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
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; padding: 40px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <tr>
                            <td style="padding: 40px;">
                                <div style="text-align: center; margin-bottom: 30px;">
                                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin: 0;">SecureExamVault</h1>
                                    <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Secure Examination System</p>
                                </div>
                                
                                <div style="text-align: center; margin-bottom: 30px;">
                                    <h2 style="color: #334155; font-size: 20px; font-weight: 600; margin-bottom: 15px;">Verification Required</h2>
                                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">
                                        You are attempting to sign in. Please use the verification code below to complete your Multi-Factor Authentication.
                                    </p>
                                </div>

                                <div style="background-color: #f1f5f9; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                                    <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #2563eb; display: block;">${otp}</span>
                                </div>

                                <div style="text-align: center;">
                                    <p style="color: #94a3b8; font-size: 14px; margin: 0;">
                                        This code will expire in <strong style="color: #64748b;">5 minutes</strong>.
                                    </p>
                                    <p style="color: #94a3b8; font-size: 14px; margin-top: 10px;">
                                        If you did not request this code, please secure your account immediately.
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f8fafc; padding: 20px; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
                                <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
                                    &copy; ${new Date().getFullYear()} SecureExamVault. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
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
