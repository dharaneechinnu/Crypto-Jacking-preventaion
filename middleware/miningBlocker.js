const Alert = require("../model/alert");
const User = require("../model/user");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Function to send email alerts
const sendEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("🚀 Alert email sent successfullys!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

// Middleware to block unauthorized mining
module.exports = async (req, res, next) => {
    const { userId, cpuUsage, gpuUsage } = req.body;

    if (cpuUsage > 90 || gpuUsage > 90) {
        // Save alert in the database
        const alert = await Alert.create({
            userId,
            cpuUsage,
            gpuUsage,
            alertMessage: "🚨 High CPU/GPU usage detected! Possible unauthorized mining.",
        });

        // Fetch user email and send alert
        const user = await User.findById(userId);
        if (user) {
            await sendEmail(user.email, "🚨 Mining Alert!", alert.alertMessage);
        }

        return res.status(403).json({
            message: "Unauthorized mining detected! Mining blocked and alert email sent.",
        });
    }

    next();
};
