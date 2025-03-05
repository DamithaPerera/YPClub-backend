const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const jobsRoutes = require('./routes/jobs');
const applyRoutes = require('./routes/apply');
const matchesRoutes = require('./routes/matches');

require('dotenv').config();


const app = express();

app.use(bodyParser.json());

mongoose.connect(`mongodb+srv://test:${process.env.DATABASE_PASSWORD}@payever.qigsu.mongodb.net/?retryWrites=true&w=majority&appName=payever`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token)
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    jwt.verify(token, `${process.env.JWT}`, (err, decoded) => {
        if (err)
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        req.user = decoded;
        next();
    });
};

app.use('/jobs', authenticate, jobsRoutes);
app.use('/apply', authenticate, applyRoutes);
app.use('/matches', authenticate, matchesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;