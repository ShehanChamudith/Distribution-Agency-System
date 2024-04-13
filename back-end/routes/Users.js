const express = require('express');
const router = express.Router();
const DBconnect = require('../config/DBconnect');


router.get('/', (req, res) => {
    // Example query using the pool
    DBconnect.query('SELECT * FROM user', (error, results) => {
        if (error) {
            console.error('Error querying MySQL database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
  });

  module.exports = router;