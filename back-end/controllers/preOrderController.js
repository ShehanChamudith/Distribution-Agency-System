const DBconnect = require('../config/DBconnect');

const addPreOrder = (req, res) => {
    const { total_value, customerID, addedItems, pre_order_status } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    
    // Start a transaction
    DBconnect.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error starting database transaction:', err);
                connection.release();
                res.status(500).send('Internal Server Error');
                return;
            }

            // Insert into pre_order table
            const insertPreOrderQuery = 'INSERT INTO pre_order (total_value, customerID, date, pre_order_status) VALUES (?, ?, ?, ?)';
            connection.query(insertPreOrderQuery, [total_value, customerID, date, pre_order_status], (err, loadingResult) => {
                if (err) {
                    console.error('Error inserting item into pre order table:', err);
                    connection.rollback(() => {
                        connection.release();
                        res.status(500).send('Internal Server Error');
                    });
                    return;
                }

                const preorderID = loadingResult.insertId;

                // Prepare values for bulk insertion into pre_order_products table
                const preOrderValues = addedItems.map((item) => [
                    preorderID,
                    item.productID,
                    item.quantity,
                ]);

                // Insert into pre_order_products table
                const insertPreOrderProductsQuery = 'INSERT INTO pre_order_products (preorderID, productID, quantity) VALUES ?';
                connection.query(insertPreOrderProductsQuery, [preOrderValues], (err, productsResult) => {
                    if (err) {
                        console.error('Error inserting items into pre_order_products table:', err);
                        connection.rollback(() => {
                            connection.release();
                            res.status(500).send('Internal Server Error');
                        });
                        return;
                    }

                    connection.commit((err) => {
                        if (err) {
                            console.error('Error committing database transaction:', err);
                            connection.rollback(() => {
                                connection.release();
                                res.status(500).send('Internal Server Error');
                            });
                            return;
                        }
                        res.json({ message: 'Pre-order added successfully' }); // Send response indicating successful addition
                        connection.release();
                    });
                });
            });
        });
    });
};

module.exports = {
    addPreOrder,
};
