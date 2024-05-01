const DBconnect = require('../config/DBconnect');
const bcrypt = require('bcrypt');

const addUser = (req, res) => {

    const { usertype, username, password, fname, lname, email, phone, address } = req.body;

        // Generate a salt with 10 rounds
        bcrypt.genSalt(10, (saltErr, salt) => {
            if (saltErr) {
                console.error('Error generating salt:', saltErr);
                res.status(500).send('Internal Server Error');
                return;
            }

        // Hash the password with the generated salt
        bcrypt.hash(password, salt, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Assuming you have a table named 'user' with columns fname, lname, email, username, password, telephone, usertype, address
            const insertQuery = 'INSERT INTO user (usertype, username, password, firstname, lastname, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
            DBconnect.query(insertQuery, [usertype, username, hashedPassword, fname, lname, email, phone, address], (err, result) => {
                if (err) {
                    console.error('Error inserting user into database:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                } 

                res.json({ message: 'User added successfully' }); // Send response indicating successful user addition
                
            });
        });
});

}

module.exports = {
    addUser
};