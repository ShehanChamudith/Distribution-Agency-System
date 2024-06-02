const DBconnect = require("../config/DBconnect");

const addSale = (req, res) => {
  console.log(req.body);
  const { sale_amount, payment_type, note, userID, customerID, discount, cash_amount, balance, bank_name, cheque_number, cheque_value, credit_amount, addedItems } = req.body;
  const date = new Date().toISOString().slice(0, 19).replace("T", " "); // Current date and time

  // Get a connection from the pool
  DBconnect.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Start a transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction: ", err);
        connection.release(); // Release the connection back to the pool
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      const saleQuery = `INSERT INTO sale (sale_amount, payment_type, date, note, userID, customerID) VALUES (?, ?, ?, ?, ?, ?)`;
      connection.query(
        saleQuery,
        [sale_amount, payment_type, date, note, userID, customerID],
        (err, saleResults) => {
          if (err) {
            console.error("Error inserting into sale table: ", err);
            return connection.rollback(() => {
              connection.release(); // Release the connection back to the pool
              res.status(500).json({ error: "Internal server error" });
            });
          }

          const saleID = saleResults.insertId;
          const paymentQuery = `INSERT INTO payment (saleID, payment_type, customerID, discount) VALUES (?, ?, ?, ?)`;
          connection.query(
            paymentQuery,
            [saleID, payment_type, customerID, discount],
            (err, paymentResults) => {
              if (err) {
                console.error("Error inserting into payment table: ", err);
                return connection.rollback(() => {
                  connection.release(); // Release the connection back to the pool
                  res.status(500).json({ error: "Internal server error" });
                });
              }

              const paymentID = paymentResults.insertId;
              let specificSaleQuery;
              let specificSaleValues;

              switch (payment_type) {
                case 'cash':
                  specificSaleQuery = `INSERT INTO cash_sale (paymentID, cash_amount, balance) VALUES (?, ?, ?)`;
                  specificSaleValues = [paymentID, cash_amount, balance];
                  break;
                case 'cheque':
                  specificSaleQuery = `INSERT INTO cheque_sale (paymentID, bank_name, cheque_number, cheque_value) VALUES (?, ?, ?, ?)`;
                  specificSaleValues = [paymentID, bank_name, cheque_number, cheque_value];
                  break;
                case 'credit':
                  specificSaleQuery = `INSERT INTO credit_sale (paymentID, credit_amount) VALUES (?, ?)`;
                  specificSaleValues = [paymentID, credit_amount];
                  break;
                default:
                  return connection.rollback(() => {
                    connection.release(); // Release the connection back to the pool
                    res.status(400).json({ error: "Invalid payment type" });
                  });
              }

              connection.query(specificSaleQuery, specificSaleValues, (err, specificSaleResults) => {
                if (err) {
                  console.error(`Error inserting into ${payment_type} table: `, err);
                  return connection.rollback(() => {
                    connection.release(); // Release the connection back to the pool
                    res.status(500).json({ error: "Internal server error" });
                  });
                }

                // Insert into productsale table
                const productSaleQuery = `INSERT INTO productsale (saleID, productID, quantity) VALUES ?`;
                const productSaleValues = addedItems.map(item => [saleID, item.productID, item.quantity]);

                connection.query(productSaleQuery, [productSaleValues], (err, productSaleResults) => {
                  if (err) {
                    console.error("Error inserting into productsale table: ", err);
                    return connection.rollback(() => {
                      connection.release(); // Release the connection back to the pool
                      res.status(500).json({ error: "Internal server error" });
                    });
                  }

                  // Update stock_total in product table
                  const updateStockPromises = addedItems.map(item => {
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
                      // Commit the transaction
                      connection.commit((err) => {
                        if (err) {
                          console.error("Error committing transaction: ", err);
                          return connection.rollback(() => {
                            connection.release(); // Release the connection back to the pool
                            res.status(500).json({ error: "Internal server error" });
                          });
                        }

                        console.log("Sale, payment, and product sales created successfully");
                        connection.release(); // Release the connection back to the pool
                        res.status(200).json({
                          message: "Sale, payment, and product sales created successfully",
                          saleID: saleID,
                          paymentID: paymentID,
                          specificSaleID: specificSaleResults.insertId
                        });
                      });
                    })
                    .catch(err => {
                      console.error("Error updating stock totals: ", err);
                      connection.rollback(() => {
                        connection.release(); // Release the connection back to the pool
                        res.status(500).json({ error: "Internal server error" });
                      });
                    });
                });
              });
            }
          );
        }
      );
    });
  });
};

module.exports = {
  addSale,
};
