import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});


export async function sendVerificationEmail(to, code) {
    return await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: '🔑 Your Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Verification Code</h2>
                <p>Hi,</p>
                <p>Thank you for using our service. Your verification code is:</p>
                <p style="font-size: 18px; font-weight: bold; background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">
                    ${code}
                </p>
                <p>Please use this code to complete your verification process. If you did not request this code, please ignore this email.</p>
                <p style="margin-top: 20px;">Best regards,<br></p>
            </div>
        `,
        text: `Hi,\n\nThank you for using our service. Your verification code is: ${code}\n\nPlease use this code to complete your verification process. If you did not request this code, please ignore this email.\n\nBest regards,\n`,
    });
}

export async function sendNotificationEmail(to, accessedUser, ownerName, originalURL) {
    console.log(`Notification being sent to ${to} for URL: ${originalURL}`);
    console.log(`Accessed by: ${accessedUser}, Owner: ${ownerName}`);
    console.log(`Original URL: ${originalURL}`);

    await new Promise(resolve => setTimeout(resolve, 4000)); // try to fix the timeout issue
    return await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: '🔔 URL Access Notification',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">URL Access Notification</h2>
                <p>Hi <strong>${ownerName}</strong>,</p>
                <p>We wanted to let you know that <strong>${accessedUser}</strong> has accessed one of your URLs:</p>
                <p style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    <a href="${originalURL}" style="color: #1a73e8; text-decoration: none;">${originalURL}</a>
                </p>
                <p>If you did not expect this activity, please review your account settings.</p>
                <p style="margin-top: 20px;">Best regards,<br></p>
            </div>
        `,
        text: `Hi ${ownerName},\n\nWe wanted to let you know that ${accessedUser} has accessed one of your URLs:\n${originalURL}\n\nIf you did not expect this activity, please review your account settings.\n\nBest regards,\n`,
    });
}
