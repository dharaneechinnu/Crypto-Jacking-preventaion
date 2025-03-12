const express = require("express");
const router = express.Router();
const { monitorConsumption,getSystemUsage,blockUnauthorizedMining } = require("../controller/miningController");
const miningBlocker = require("../middleware/miningBlocker");

router.post("/monitor", miningBlocker, monitorConsumption);
router.get("/system-usage", getSystemUsage);
router.post("/send-email",blockUnauthorizedMining)


module.exports = router;
