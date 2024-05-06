const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json())

const authRoute = require('./routes/authRoute');
app.use('/', authRoute);

const userRoute = require('./routes/userRoute');
app.use('/home', userRoute); 

const getRoute = require('./routes/getRoute');
app.use('/', getRoute);

const deleteRoute = require('./routes/deleteRoute');
app.use('/', deleteRoute);

const itemRoute = require('./routes/itemRoute');
app.use('/', itemRoute); 


// Start the Express server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});