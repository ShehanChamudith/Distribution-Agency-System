const express = require('express');
const mysql = require('mysql');
                                                                                                                                                                                                                                                                                                                                                                         
const app = express();

// MySQL database connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'development_project'
});
                                                                                                                                                                                                                                                                            
// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Define a route to fetch data from MySQL database
app.get('/data', (req, res) => {
    // Query data from MySQL database                                                   
    connection.query('SELECT * FROM user', (err, rows) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows); // Send fetched data as JSON response
    });
});

// Start the Express server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});