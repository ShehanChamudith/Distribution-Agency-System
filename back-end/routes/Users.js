const express = require('express');
const router = express.Router();
const DBconnect = require('../config/DBconnect');
const bcrypt = require('bcrypt');

router.use(express.json());



router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    
    DBconnect.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (rows.length === 1) {
            const { usertype } = rows[0];
            res.json({ usertype }); // Send user role if login is successful
        } else {
            res.status(401).json({ error: 'Invalid username or password' }); // Send error if login fails
        }
    });
      
});



    

// router.get('/', (req, res) => {
//     // Example query using the pool
//     DBconnect.query('SELECT * FROM user', (error, results) => {
//         if (error) {
//             console.error('Error querying MySQL database:', error);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         res.json(results);
//     });
//   });


  module.exports = router;










