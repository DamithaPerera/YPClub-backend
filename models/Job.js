const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    skills: [String],
    company: String,
    createdAt: { type: Date, default: Date.now }
});

JobSchema.index({ title: "text", description: "text", skills: 1 });

module.exports = mongoose.model('Job', JobSchema);
