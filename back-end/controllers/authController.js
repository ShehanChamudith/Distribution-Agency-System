const DBconnect = require('../config/DBconnect');

//Login Function
const login = (req,res) => { 

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

}

//Logout Function
const logout = (req,res) => {

}

module.exports = {
    login,
    logout
   
};