const DBconnect = require('../config/DBconnect');
const jwt = require('jsonwebtoken');

// Login Function
const login = (req, res) => {
    const { username, password } = req.body;
    
    DBconnect.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (rows.length === 1) {
            const { username, userID, usertypeID } = rows[0];
            const accessToken = jwt.sign({ username, userID, usertypeID }, "jwtSecretToken");

            res.json({ accessToken }); // Send user role if login is successful
        } else {
            res.json({ error: 'Invalid username or password' });
        }
    });
};

module.exports = { login };


//Logout Function
const logout = (req,res) => {

}

module.exports = {
    login,
    logout
   
};