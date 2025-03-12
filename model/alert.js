const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    alertMessage: { type: String, required: true },
    alertDate: { type: Date, default: Date.now },
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
