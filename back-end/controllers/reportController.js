const DBconnect = require("../config/DBconnect");

const salesReport = (req, res) => {
    const { startDate, endDate, paymentType, customerID, userID } = req.body;
    let query = `
      SELECT s.*, u.firstname, c.shop_name
      FROM sale s
      JOIN user u ON s.userID = u.userID
      JOIN customer c ON s.customerID = c.customerID
      WHERE 1=1
    `;
  
    if (startDate) query += ` AND s.date >= '${startDate}'`;
    if (endDate) query += ` AND s.date <= '${endDate}'`;
    if (paymentType) query += ` AND s.payment_type = '${paymentType}'`;
    if (customerID) query += ` AND s.customerID = ${customerID}`;
    if (userID) query += ` AND s.userID = ${userID}`;
  
    DBconnect.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
};

// Controller for inventory report
const inventoryReport = (req, res) => {
    const { startDate, endDate, productID, supplierID } = req.body;
    let query = `
      SELECT i.*, p.product_name, s.supplier_company
      FROM inventory i
      JOIN product p ON i.productID = p.productID
      JOIN supplier s ON i.supplierID = s.supplierID
      WHERE 1=1
    `;
  
    if (startDate) query += ` AND i.purchase_date >= '${startDate}'`;
    if (endDate) query += ` AND i.purchase_date <= '${endDate}'`;
    if (productID) query += ` AND i.productID = '${productID}'`;
    if (supplierID) query += ` AND i.supplierID = '${supplierID}'`;
  
    DBconnect.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
};

const paymentLogReport = (req, res) => {
    const { startDate, endDate, paymentType, customerID } = req.body;
    console.log(req.body);
    let query = `
      SELECT pl.*, c.shop_name
      FROM payment_log pl
      JOIN customer c ON pl.customerID = c.customerID
      WHERE 1=1
    `;
  
    if (startDate) query += ` AND pl.date >= '${startDate}'`;
    if (endDate) query += ` AND pl.date <= '${endDate}'`;
    if (paymentType) query += ` AND pl.payment_type = '${paymentType}'`;
    if (customerID) query += ` AND pl.customerID = '${customerID}'`;
  
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
    inventoryReport,
    paymentLogReport,
  }