const DBconnect = require('../config/DBconnect');


const addLoading = (req, res) => {
    const { total_value, repID, addedItems, vehicleID, userID } = req.body;
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
            const insertLoadingQuery = 'INSERT INTO loading (total_value, repID, vehicleID, date, userID) VALUES (?, ?, ?, ?, ?)';
            connection.query(insertLoadingQuery, [total_value, repID, vehicleID, date, userID], (err, loadingResult) => {
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
                });
            });
        });
    });
};

module.exports = {
    addLoading,
};
