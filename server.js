const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes

app.use(express.json());  // Enable JSON parsing

// Your routes go here
app.use('/auth', require('./routes/auth'));
app.use('/scores', require('./routes/scores'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
