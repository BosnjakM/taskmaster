const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sendet eine E-Mail mit professionellem HTML-Layout
 * @param {string} recipient - Die Empfänger-E-Mail-Adresse
 * @param {string} subject - Der Betreff der E-Mail
 * @param {string} message - Die Nachricht der E-Mail (wird als HTML formatiert)
 */
const sendEmail = async (recipient, subject, message) => {
    const mailOptions = {
        from: `"TaskMaster" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #333;">📌 ${subject}</h2>
                <p style="font-size: 16px; color: #555;">${message}</p>
                <hr />
                <p style="font-size: 12px; color: #888;">TaskMaster - Ihre Aufgaben immer im Blick.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${recipient}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

module.exports = sendEmail;
