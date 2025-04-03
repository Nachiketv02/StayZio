const nodemailer = require("nodemailer");

module.exports.sendEmail = async ({ email, subject, message }) => {
    if (!email) {
        console.error("❌ Error: No recipient email provided!");
        throw new Error("Recipient email is required");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject,
        html: message
    };

    console.log(`📧 Sending email to: ${email}`);
    return await transporter.sendMail(mailOptions);
};