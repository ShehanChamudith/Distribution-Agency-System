const DBconnect = require('../config/DBconnect');


const addInventory = (req, res) => {

    const { stock_arrival, supplierID, purchase_date, expire_date, productID, wstaffID, batch_no } = req.body;

    const insertQuery = 'INSERT INTO inventory ( stock_arrival, supplierID, purchase_date, expire_date, productID, wstaffID, batch_no) VALUES (?, ?, ?, ?, ?, ?, ?)';

    DBconnect.query(insertQuery, [stock_arrival, supplierID, purchase_date, expire_date, productID, wstaffID, batch_no], (err, result) => {
        if (err) {
            console.error('Error inserting stock into database:', err);
            res.status(500).send('Internal Server Error');
            return;
        } 

        res.json({ message: 'Stock added successfully' }); // Send response indicating successful stock addition
        
    });

};

const deleteStock = (req, res) => {
    const inventoryID = req.params.inventoryID;
    const sql = 'DELETE FROM inventory WHERE inventoryID = ?';
  
    DBconnect.query(sql, [inventoryID], (err, result) => {
      if (err) {
        console.error('Error deleting row:', err);
        res.status(500).json({ error: 'An error occurred while deleting the row' });
        return;
      }
      console.log('Row deleted successfully...');
      res.status(200).json({ message: 'Row deleted successfully' });
    });
}

module.exports = {
  addInventory,
  deleteStock
};
