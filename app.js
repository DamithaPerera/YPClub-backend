const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');



const app = express();

app.use(bodyParser.json());

mongoose.connect(`mongodb+srv://DamithaPerera:${process.env.DATABASE_PASSWORD}@payever.qigsu.mongodb.net/?retryWrites=true&w=majority&appName=payever`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;