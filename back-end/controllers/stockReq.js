const DBconnect = require("../config/DBconnect");

const addStockReq = (req, res) => {
  const { addedItems, supplierID, note } = req.body;
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");

  // Start a transaction
  DBconnect.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting database transaction:", err);
        connection.release();
        res.status(500).send("Internal Server Error");
        return;
      }

      // Insert into stock_request table
      const stockRequestQuery =
        "INSERT INTO stock_request (supplierID, date, notes) VALUES (?, ?, ?)";
      connection.query(
        stockRequestQuery,
        [supplierID, date, note],
        (err, result) => {
          if (err) {
            console.error("Error inserting item into pre order table:", err);
            connection.rollback(() => {
              connection.release();
              res.status(500).send("Internal Server Error");
            });
            return;
          }

          const requestID = result.insertId;

          // Prepare values for bulk insertion into pre_order_products table
          const preOrderValues = addedItems.map((item) => [
            requestID,
            item.productID,
            item.quantity,
          ]);

          // Insert into pre_order_products table
          const requestProductsQuery =
            "INSERT INTO request_products (requestID, productID, quantity) VALUES ?";
          connection.query(
            requestProductsQuery,
            [preOrderValues],
            (err, productsResult) => {
              if (err) {
                console.error(
                  "Error inserting items into pre_order_products table:",
                  err
                );
                connection.rollback(() => {
                  connection.release();
                  res.status(500).send("Internal Server Error");
                });
                return;
              }

              connection.commit((err) => {
                if (err) {
                  console.error("Error committing database transaction:", err);
                  connection.rollback(() => {
                    connection.release();
                    res.status(500).send("Internal Server Error");
                  });
                  return;
                }
                res.json({ message: "Pre-order added successfully" }); // Send response indicating successful addition
                connection.release();
              });
            }
          );
        }
      );
    });
  });
};

module.exports = {
  addStockReq,
};
