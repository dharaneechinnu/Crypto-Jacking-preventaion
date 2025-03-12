const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  secret2FA: { type: String }, // Google Authenticator Secret
  devices: [{ ip: String, device: String, lastLogin: Date }],
});

module.exports = mongoose.model("User", UserSchema);
