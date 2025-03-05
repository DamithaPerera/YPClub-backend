const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userSkills = req.query.skills ? req.query.skills.split(',') : [];

        const jobs = await Job.find({ skills: { $in: userSkills } });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
