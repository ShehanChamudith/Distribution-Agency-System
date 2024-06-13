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

  // Assuming you're using Express.js for your backend

// Route for inventory report
const inventoryReport = (req, res) => {
    const { startDate, endDate, productID, supplierID } = req.body;
    console.log(req.body);
    let query = 'SELECT * FROM inventory WHERE 1=1';
  
    if (startDate) query += ` AND purchase_date >= '${startDate}'`;
    if (endDate) query += ` AND purchase_date <= '${endDate}'`;
    if (productID) query += ` AND productID IN (SELECT productID FROM product WHERE productID = '${productID}')`;
    if (supplierID) query += ` AND supplierID = ${supplierID}`;
  
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
    inventoryReport
  }