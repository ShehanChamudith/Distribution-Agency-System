const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json())

const userRoute = require('./routes/authRoute');
app.use('/', userRoute);


// Start the Express server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});