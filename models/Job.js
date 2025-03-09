const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const JobSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    description: String,
    skills: [String],
    company: String,
    createdAt: { type: Date, default: Date.now }
});

JobSchema.index({ title: "text", description: "text" });

JobSchema.index({ skills: 1 });

module.exports = mongoose.model('Job', JobSchema);