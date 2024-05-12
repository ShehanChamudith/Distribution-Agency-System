const DBconnect = require('../config/DBconnect');


const addInventory = (req, res) => {
    const { stock_arrival, supplierID, purchase_date, expire_date, productID, wstaffID, batch_no } = req.body;

    // Define the insert query for the inventory table
    const insertQuery = 'INSERT INTO inventory (stock_arrival, supplierID, purchase_date, expire_date, productID, wstaffID, batch_no) VALUES (?, ?, ?, ?, ?, ?, ?)';

    // Execute the insert query for the inventory table
    DBconnect.query(insertQuery, [stock_arrival, supplierID, purchase_date, expire_date, productID, wstaffID, batch_no], (err, result) => {
        if (err) {
            console.error('Error inserting stock into database:', err);
            res.status(500).send('Internal Server Error');
            return;
        } 

        // Once the inventory record is successfully inserted, update the stock_total in the product table
        const updateQuery = 'UPDATE product SET stock_total = stock_total + ? WHERE productID = ?';
        DBconnect.query(updateQuery, [stock_arrival, productID], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Error updating stock_total in product table:', updateErr);
                // You might want to consider rolling back the inventory insert here to maintain consistency
                res.status(500).send('Internal Server Error');
                return;
            }

            // Send response indicating successful stock addition and stock_total update
            res.json({ message: 'Stock added successfully and stock_total updated' }); 
        });
    });
};


const deleteStock = (req, res) => {
    const inventoryID = req.params.inventoryID;
    const sql = 'DELETE FROM inventory WHERE inventoryID = ?';

    // Fetch the productID associated with the inventory entry before deleting it
    const getProductIDQuery = 'SELECT productID, stock_arrival FROM inventory WHERE inventoryID = ?';
    DBconnect.query(getProductIDQuery, [inventoryID], (err, rows) => {
        if (err) {
            console.error('Error retrieving productID:', err);
            res.status(500).json({ error: 'An error occurred while retrieving the productID' });
            return;
        }

        if (rows.length === 0) {
            res.status(404).json({ error: 'Inventory entry not found' });
            return;
        }

        const { productID, stock_arrival } = rows[0];

        // Execute the delete query for the inventory table
        DBconnect.query(sql, [inventoryID], (deleteErr, result) => {
            if (deleteErr) {
                console.error('Error deleting row:', deleteErr);
                res.status(500).json({ error: 'An error occurred while deleting the row' });
                return;
            }

            // Update the stock_total in the product table
            const updateProductQuery = 'UPDATE product SET stock_total = stock_total - ? WHERE productID = ?';
            DBconnect.query(updateProductQuery, [stock_arrival, productID], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Error updating stock_total in product table:', updateErr);
                    // You might want to consider rolling back the inventory delete here to maintain consistency
                    res.status(500).json({ error: 'An error occurred while updating stock_total in product table' });
                    return;
                }

                // Send response indicating successful row deletion and stock_total update
                res.status(200).json({ message: 'Row deleted successfully and stock_total updated' });
            });
        });
    });
};


module.exports = {
  addInventory,
  deleteStock
};
