const DBconnect = require("../config/DBconnect");

const addPreOrder = (req, res) => {
  const { total_value, customerID, addedItems, pre_order_status } = req.body;
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

      // Insert into pre_order table
      const insertPreOrderQuery =
        "INSERT INTO pre_order (total_value, customerID, date, pre_order_status) VALUES (?, ?, ?, ?)";
      connection.query(
        insertPreOrderQuery,
        [total_value, customerID, date, pre_order_status],
        (err, loadingResult) => {
          if (err) {
            console.error("Error inserting item into pre order table:", err);
            connection.rollback(() => {
              connection.release();
              res.status(500).send("Internal Server Error");
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
          const insertPreOrderProductsQuery =
            "INSERT INTO pre_order_products (preorderID, productID, quantity) VALUES ?";
          connection.query(
            insertPreOrderProductsQuery,
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

const getPreOrderTotalToLoad = (req, res) => {
  const { areaID } = req.query;

  if (!areaID) {
    return res.status(400).json({ message: "areaID is required" });
  }

  const query = `
      SELECT 
        pop.productID,
        p.product_name, 
        p.selling_price, 
        p.image_path,
        ROUND(SUM(pop.quantity), 3) AS total_quantity,
        po.preorderID
      FROM pre_order_products pop
      JOIN product p ON pop.productID = p.productID
      JOIN supplier s ON p.supplierID = s.supplierID
      JOIN pre_order po ON pop.preorderID = po.preorderID
      JOIN customer c ON po.customerID = c.customerID
      WHERE po.pre_order_status = 'pending'
        AND c.areaID = ?
      GROUP BY pop.productID, p.product_name, p.selling_price, p.image_path, po.preorderID, s.supplier_company
      ORDER BY total_quantity DESC;
    `;

  DBconnect.query(query, [areaID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length > 0) {
      const addedItems = results.map((row) => ({
        productID: row.productID,
        product_name: row.product_name,
        quantity: row.total_quantity,
        selling_price: row.selling_price,
        image_path: row.image_path,
        preorderID: row.preorderID,
      }));

      res.json({ addedItems });
    } else {
      res.status(404).json({ error: "No pending pre-order products found" });
    }
  });
};

const getPreOrderById = (req, res) => {
  const preorderID = req.params.preorderID;
  //console.log(preorderID);

  const getPreOrderQuery = `
    SELECT 
      po.preorderID, po.customerID, po.pre_order_status,
      c.shop_name,
      pop.productID, pop.quantity,
      p.product_name, p.stock_total, p.selling_price, p.image_path
    FROM pre_order po
    JOIN pre_order_products pop ON po.preorderID = pop.preorderID
    JOIN product p ON pop.productID = p.productID
    JOIN customer c ON po.customerID = c.customerID
    WHERE po.preorderID = ?;
  `;

  DBconnect.query(getPreOrderQuery, [preorderID], (error, results) => {
    if (error) {
      console.error("Error fetching preorder data:", error);
      res.status(500).json({ error: "Error fetching preorder data" });
    } else {
      if (results.length > 0) {
        const preorderData = {
          preorderID: results[0].preorderID,
          customerID: results[0].customerID,
          pre_order_status: results[0].pre_order_status,
          shop_name: results[0].shop_name,
          addedItems: results.map((row) => ({
            productID: row.productID,
            product_name: row.product_name,
            quantity: row.quantity,
            stock_total: row.stock_total,
            selling_price: row.selling_price,
            image_path: row.image_path,
          })),
        };
        res.json({ preorderData });
      } else {
        res.status(404).json({ error: "Preorder data not found" });
      }
    }
  });
};


module.exports = {
  addPreOrder,
  getPreOrderTotalToLoad,
  getPreOrderById,
};
