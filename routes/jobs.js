const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const redisClient = require('../redisClient');

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
        const cacheKey = `jobs_page_${page}`;

        const cachedJobs = await redisClient.get(cacheKey);
        if (cachedJobs) {
            return res.json(JSON.parse(cachedJobs));
        }

        const jobs = await Job.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        await redisClient.set(cacheKey, JSON.stringify(jobs), { EX: 60 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;