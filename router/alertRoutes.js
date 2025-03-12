const express = require("express");
const router = express.Router();
const Alert = require("../model/alert");

// Fetch alerts for a user
router.get("/:userId", async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.status(200).json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
