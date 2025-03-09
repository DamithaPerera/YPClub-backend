const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Application = require('../models/Application');
const Job = require('../models/Job');

const applyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many applications from this user, please try again later.'
});

router.post('/', applyLimiter, async (req, res) => {
    try {
        const { jobId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const existingApp = await Application.findOne({ job: jobId });
        if (existingApp) {
            return res.status(400).json({ message: 'Already applied for this job' });
        }

        const application = new Application({ job: jobId });
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
