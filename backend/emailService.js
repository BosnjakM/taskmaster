const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail", // Nutze Gmail oder andere E-Mail-Provider
    auth: {
        user: process.env.EMAIL_USER, // Deine E-Mail
        pass: process.env.EMAIL_PASS, // App-Passwort
    },
});

// 📩 Funktion zum Senden der Verifizierungs-E-Mail
const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:5002/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email - TaskMaster",
        html: `
            <h1>Welcome to TaskMaster!</h1>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">Verify Email</a>
            <p>This link expires in 24 hours.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Verification email sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
    }
};

module.exports = sendVerificationEmail;
