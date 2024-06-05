const DBconnect = require("../config/DBconnect");

//get product items from product table( to show items ) and relavant category from category table ( category for what - for filter based on category )
const inventoryGet = (req, res) => {
  DBconnect.query(
    "SELECT p.*, c.category, s.supplier_company FROM product p JOIN category c ON p.categoryID = c.categoryID JOIN supplier s ON p.supplierID = s.supplierID",
    (err, results) => {
      if (err) {
        console.error("Error querying MySQL database:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (results.length === 0) {
        console.warn("No data found in product table");
        res.status(404).send("No data found");
        return;
      }

      res.json(results);
    }
  );
};

//get categories from category table ( for form dropdown selector )
const categoryGet = (req, res) => {
  DBconnect.query("SELECT * FROM category", (err, results) => {
    if (err) {
      console.error("Error querying MySQL database:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      console.warn("No data found in category table");
      res.status(404).send("No data found");
      return;
    }

    res.json(results);
  });
};

// load the existing item data into edit form
const getItem = (req, res) => {
  const productId = req.params.productId;
  const sql = "SELECT * FROM product WHERE productID = ?";

  DBconnect.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("Error getting row:", err);
      res
        .status(500)
        .json({ error: "An error occurred while getting the row" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    console.log("Row fetched successfully");
    // Sending the fetched row in the response
    res.status(200).json(result[0]); // Assuming there's only one row with the given ID
  });
};

//not used yet, but it is for preload the category of a particular item to the edit form
const getCategory = (req, res) => {
  const productId = req.params.productId;
  const sql =
    "SELECT c.category FROM product p JOIN category c ON p.categoryID = c.categoryID WHERE p.productID = ?";

  DBconnect.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("Error getting Category:", err);
      res
        .status(500)
        .json({ error: "An error occurred while getting the Category" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    console.log("Category fetched successfully");
    // Sending the fetched row in the response
    res.status(200).json(result[0]); // Assuming there's only one row with the given ID
  });
};

//get the stock to the inventory table
const getStock = (req, res) => {
  DBconnect.query(
    `SELECT i.*, p.product_name, s.supplier_company, DATE_FORMAT(i.purchase_date, '%Y-%m-%d') AS formatted_purchase_date, DATE_FORMAT(i.expire_date, '%Y-%m-%d') AS formatted_expire_date
    FROM inventory AS i 
    JOIN product AS p ON i.productID = p.productID 
    JOIN supplier AS s ON i.supplierID = s.supplierID 
    ORDER BY i.inventoryID DESC`,
    (err, results) => {
      if (err) {
        console.error("Error querying MySQL database:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (results.length === 0) {
        console.warn("No data found in inventory table");
        res.status(404).send("No data found");
        return;
      }

      res.json(results);
    }
  );
};

const getSupplier = (req, res) => {
  DBconnect.query("SELECT * FROM supplier", (err, results) => {
    if (err) {
      console.error("Error querying MySQL database:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      console.warn("No data found in supplier table");
      res.status(404).send("No data found");
      return;
    }

    res.json(results);
  });
};

const getCustomer = (req, res) => {
  DBconnect.query("SELECT * FROM customer", (err, results) => {
    if (err) {
      console.error("Error querying MySQL database:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      console.warn("No data found in customer table");
      res.status(404).send("No data found");
      return;
    }

    res.json(results);
  });
};

const getSalesRep = (req, res) => {
  DBconnect.query(
    "SELECT * FROM salesrep INNER JOIN user ON salesrep.userID = user.userID",
    (err, results) => {
      if (err) {
        console.error("Error querying MySQL database:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (results.length === 0) {
        console.warn("No data found in salesrep table");
        res.status(404).send("No data found");
        return;
      }

      res.json(results);
    }
  );
};

const getSale = (req, res) => {
  DBconnect.query(
    "SELECT saleID FROM sale ORDER BY saleID DESC LIMIT 1",
    (err, results) => {
      if (err) {
        console.error("Error querying MySQL database:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const saleID = results.length === 0 ? 0 : results[0].saleID;
      res.json({ saleID });
    }
  );
};

const getVehicle = (req, res) => {
  DBconnect.query("SELECT * FROM vehicle", (err, results) => {
    if (err) {
      console.error("Error querying MySQL database:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      console.warn("No data found in user table");
      res.status(404).send("No data found");
      return;
    }

    res.json(results);
  });
};

const getLoading = (req, res) => {
  // Fetch all rows from the loading table with joined data from loading_products and product tables
  const selectAllQuery = `
  SELECT 
  l.loadingID, l.total_value, l.repID, l.vehicleID, l.date, l.userID, l.loading_status,
  lp.productID, lp.quantity,
  p.product_name,
  u.firstname as rep_firstname,
  v.vehicle_number  -- Select vehicle_number from the vehicle table
FROM loading l
JOIN loading_products lp ON l.loadingID = lp.loadingID
JOIN product p ON lp.productID = p.productID
JOIN salesrep s ON l.repID = s.repID
JOIN user u ON s.userID = u.userID
JOIN vehicle v ON l.vehicleID = v.vehicleID -- Join with the vehicle table
ORDER BY l.loadingID DESC;

`;

  DBconnect.query(selectAllQuery, (err, loadingResults) => {
    if (err) {
      console.error("Error querying MySQL database for loading table:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Fetch the latest loadingID
    const latestLoadingIDQuery =
      "SELECT loadingID FROM loading ORDER BY loadingID DESC LIMIT 1";
    DBconnect.query(latestLoadingIDQuery, (err, latestLoadingIDResult) => {
      if (err) {
        console.error(
          "Error querying MySQL database for latest loadingID:",
          err
        );
        res.status(500).send("Internal Server Error");
        return;
      }

      const uniqueloadingID =
        latestLoadingIDResult.length === 0
          ? 0
          : latestLoadingIDResult[0].loadingID;

      res.json({ uniqueloadingID, loadingResults });
    });
  });
};

const getLoadingProducts = (req, res) => {
  const loadingID = req.params.loadingID;

  const selectAllQuery = `
  SELECT 
    p.productID, 
    p.product_name, 
    p.image_path, 
    p.selling_price, 
    lp.quantity, 
    c.category, 
    lp.loadingID,
    l.loading_status
FROM 
    product p
INNER JOIN 
    loading_products lp ON p.productID = lp.productID
INNER JOIN 
    category c ON p.categoryID = c.categoryID
INNER JOIN 
    loading l ON lp.loadingID = l.loadingID
WHERE 
    l.loading_status = 'pending';

  `;

  DBconnect.query(selectAllQuery, [loadingID], (err, results) => {
    if (err) {
      console.error("Error querying MySQL database:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      console.warn("No data found in product table");
      res.status(404).send("No data found");
      return;
    }

    res.json(results);
  });
};

module.exports = {
  inventoryGet,
  categoryGet,
  getItem,
  getCategory,
  getStock,
  getSupplier,
  getCustomer,
  getSale,
  getSalesRep,
  getLoading,
  getVehicle,
  getLoadingProducts,
};
