const express = require('express');
const cors = require('cors');
const DBconnect = require('./config/DBconnect');

const app = express();

app.use(cors());
app.use(express.json())

const authRoute = require('./routes/authRoute');
app.use('/', authRoute);

const userRoute = require('./routes/userRoute');
app.use('/home', userRoute); 

const getRoute = require('./routes/getRoute');
app.use('/', getRoute);

// const deleteRoute = require('./routes/deleteRoute');
// app.use('/api', deleteRoute);

// Example route in Express.js for deleting a row
app.delete('/inventory/:productId', (req, res) => {
    const productId = req.params.productId;
    const sql = 'DELETE FROM product WHERE productID = ?';
  
    DBconnect.query(sql, [productId], (err, result) => {
      if (err) {
        console.error('Error deleting row:', err);
        res.status(500).json({ error: 'An error occurred while deleting the row' });
        return;
      }
      console.log('Row deleted successfully');
      res.status(200).json({ message: 'Row deleted successfully' });
    });
  });
  


// Start the Express server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});