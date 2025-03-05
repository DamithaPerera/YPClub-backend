const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    user: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now }
});

ApplicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
