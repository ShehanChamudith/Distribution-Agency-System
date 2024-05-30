const DBconnect = require('../config/DBconnect');
const bcrypt = require('bcrypt');

const addUser = (req, res) => {
    const { usertypeID, username, password, firstname, lastname, email, phone, address, area, shop_name } = req.body;

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

            console.log(req.body);
            // Assuming you have a table named 'user' with columns fname, lname, email, username, password, telephone, usertype, address
            const insertUserQuery = 'INSERT INTO user (usertypeID, username, password, firstname, lastname, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
            DBconnect.query(insertUserQuery, [usertypeID, username, hashedPassword, firstname, lastname, email, phone, address], (err, result) => {
                if (err) {
                    console.error('Error inserting user into database:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                // Get the last inserted user ID
                const userID = result.insertId;

                // If usertype is 6, insert into the customer table
                if (usertypeID === 6) {
                    const insertCustomerQuery = 'INSERT INTO customer (userID, area, shop_name) VALUES (?, ?, ?)';
                    
                    DBconnect.query(insertCustomerQuery, [userID, area, shop_name], (customerErr, customerResult) => {
                        if (customerErr) {
                            console.error('Error inserting customer into database:', customerErr);
                            res.status(500).send('Internal Server Error');
                            return;
                        }

                        res.json({ message: 'User and customer added successfully' });
                    });
                } else {
                    res.json({ message: 'User added successfully' });
                }
            });
        });
    });
}

module.exports = {
    addUser
};