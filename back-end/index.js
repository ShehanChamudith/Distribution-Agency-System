const express = require('express');
const DBconnect = require('./config/DBconnect');
const cors = require('cors');

const app = express();

app.use(cors());

const userRoute = require('./routes/Users');
app.use('/login', userRoute);


// Start the Express server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});