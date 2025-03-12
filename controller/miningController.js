const Alert = require("../model/alert");
const User = require("../model/user");
const Consumption = require("../model/Consumption");
const nodemailer = require("nodemailer");
const si = require("systeminformation");
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
        subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("🚀 Alert email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

// Function to monitor system consumption
const monitorConsumption = async (req, res) => {
    try {
        const { userId, cpuUsage, gpuUsage } = req.body;

        if (cpuUsage > 80 || gpuUsage > 80) {
            return res.status(403).json({
                message: "🚨 High resource consumption detected! Mining blocked.",
            });
        }

        const consumptionData = new Consumption({ userId, cpuUsage, gpuUsage });
        await consumptionData.save();

        res.status(200).json({ message: "✅ Usage monitored successfully." });
    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Function to block unauthorized mining and send alerts
const blockUnauthorizedMining = async (req, res, next) => {
    try {
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
                message: "❌ Unauthorized mining detected! Mining blocked and alert email sent.",
            });
        }

        next();
    } catch (err) {
        console.error("❌ Error in mining detection:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Function to get real-time system usage data
const getSystemUsage = async (req, res) => {
    try {
        const cpuLoad = await si.currentLoad();
        const gpuLoad = await si.graphics();

        let gpuUsage = 0;
        if (gpuLoad.controllers.length > 0) {
            gpuUsage = gpuLoad.controllers[0].utilizationGpu || 0;
        }

        res.json({
            cpuUsage: cpuLoad.currentLoad.toFixed(2),
            gpuUsage: gpuUsage.toFixed(2),
        });
    } catch (error) {
        console.error("❌ Error fetching system usage:", error);
        res.status(500).json({ message: "Error fetching system usage" });
    }
};

module.exports = { getSystemUsage, monitorConsumption, blockUnauthorizedMining };
