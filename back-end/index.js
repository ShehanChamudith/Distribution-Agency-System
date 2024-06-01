const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
//const { validateToken, checkRole } = require('./middleware/authMiddleware');

app.use(cors());
app.use(express.json())

const authRoute = require('./routes/authRoute');
app.use('/', authRoute);

const userRoute = require('./routes/userRoute');
app.use('/', userRoute); 

const getRoute = require('./routes/getRoute');
app.use('/', getRoute);

const itemRoute = require('./routes/itemRoute');
app.use('/', itemRoute);

const inventoryRoute = require('./routes/inventoryRoute');
app.use('/', inventoryRoute);

const saleRoute = require('./routes/saleRoute');
app.use('/', saleRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Start the Express server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});