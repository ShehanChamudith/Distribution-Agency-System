const express = require('express');
const DBpool = require('./config/DBconnect');
const cors = require('cors');

const app = express();
app.use(cors());


app.get('/data', (req, res) => {
    // Example query using the pool
    DBpool.query('SELECT * FROM user', (error, results) => {
        if (error) {
            console.error('Error querying MySQL database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
  });

// Start the Express server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});