// routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const jobs = await Job.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
