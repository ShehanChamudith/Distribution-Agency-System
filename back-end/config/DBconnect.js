const mysql = require('mysql');                                                                                                                                                                                                                                                                                                                                                                   

// MySQL database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'development_project'
};
                                                                                                                                                                                                                                                                            
// Create a MySQL pool
const DBpool = mysql.createPool(dbConfig);

// Listen for errors during pool creation
DBpool.on('error', (err) => {

        if (err) {
            console.error('Error connecting to MySQL database:', err);
        return;
        }
        console.log('Connected to MySQL database');
  });


module.exports = DBpool;













// Connect to MySQL database
// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL database:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

// module.exports = DBconnect;