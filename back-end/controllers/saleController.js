const DBconnect = require('../config/DBconnect');

const addSale = (req, res) => {
    console.log(req.body);
    const { sale_amount, payment_type, note, userID, customerID } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current date and time

const query = `INSERT INTO sale (sale_amount, payment_type, date, note, userID, customerID) VALUES (?, ?, ?, ?, ?, ?)`;
DBconnect.query(query, [sale_amount, payment_type, date, note, userID, customerID], (err, results) => {
    if (err) {
      console.error('Error inserting into sale table: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Sale created successfully');
    res.status(200).json({ message: 'Sale created successfully', saleID: results.insertId });
  });
}

module.exports = {
    addSale
};