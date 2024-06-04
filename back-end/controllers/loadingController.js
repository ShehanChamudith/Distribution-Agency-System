const DBconnect = require('../config/DBconnect');

const addLoading = (req, res) => {
    const { total_value, repID, addedItems, vehicleID, userID, loading_status } = req.body;
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

            // Insert into loading table
            const insertLoadingQuery = 'INSERT INTO loading (total_value, repID, vehicleID, date, userID, loading_status) VALUES (?, ?, ?, ?, ?, ?)';
            connection.query(insertLoadingQuery, [total_value, repID, vehicleID, date, userID, loading_status], (err, loadingResult) => {
                if (err) {
                    console.error('Error inserting item into loading table:', err);
                    connection.rollback(() => {
                        connection.release();
                        res.status(500).send('Internal Server Error');
                    });
                    return;
                }

                const loadingID = loadingResult.insertId;

                // Prepare values for bulk insertion into loading_products table
                const productSaleValues = addedItems.map((item) => [
                    loadingID,
                    item.productID,
                    item.quantity,
                ]);

                // Insert into loading_products table
                const insertLoadingProductsQuery = 'INSERT INTO loading_products (loadingID, productID, quantity) VALUES ?';
                connection.query(insertLoadingProductsQuery, [productSaleValues], (err, productsResult) => {
                    if (err) {
                        console.error('Error inserting items into loading_products table:', err);
                        connection.rollback(() => {
                            connection.release();
                            res.status(500).send('Internal Server Error');
                        });
                        return;
                    }

                    // Update stock_total in product table
                    const updateStockPromises = addedItems.map((item) => {
                        return new Promise((resolve, reject) => {
                            const updateStockQuery = `UPDATE product SET stock_total = stock_total - ? WHERE productID = ?`;
                            connection.query(updateStockQuery, [item.quantity, item.productID], (err, result) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        });
                    });

                    Promise.all(updateStockPromises)
                        .then(() => {
                            connection.commit((err) => {
                                if (err) {
                                    console.error('Error committing database transaction:', err);
                                    connection.rollback(() => {
                                        connection.release();
                                        res.status(500).send('Internal Server Error');
                                    });
                                    return;
                                }
                                res.json({ message: 'Item and products added successfully' }); // Send response indicating successful addition
                                connection.release();
                            });
                        })
                        .catch((err) => {
                            console.error('Error updating product stock:', err);
                            connection.rollback(() => {
                                connection.release();
                                res.status(500).send('Internal Server Error');
                            });
                        });
                });
            });
        });
    });
};

module.exports = {
    addLoading,
};
