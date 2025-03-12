const mongoose = require("mongoose");

const ConsumptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cpuUsage: { type: Number, required: true },
  gpuUsage: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Consumption", ConsumptionSchema);
