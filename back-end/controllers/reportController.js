const DBconnect = require("../config/DBconnect");

const salesReport = (req, res) => {
    const { startDate, endDate, paymentType, customerID, userID } = req.body;
    let query = 'SELECT * FROM sale WHERE 1=1';
  
    if (startDate) query += ` AND date >= '${startDate}'`;
    if (endDate) query += ` AND date <= '${endDate}'`;
    if (paymentType) query += ` AND payment_type = '${paymentType}'`;
    if (customerID) query += ` AND customerID = ${customerID}`;
    if (userID) query += ` AND userID = ${userID}`;
  
    DBconnect.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
  };


  module.exports = {
    salesReport,
  }