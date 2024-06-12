const DBconnect = require("../config/DBconnect");

//get product items from product table( to show items ) and relavant category from category table ( category for what - for filter based on category )
const inventoryGet = (req, res) => {
  DBconnect.query(
    `SELECT p.*, c.category, s.supplier_company
FROM product p
JOIN category c ON p.categoryID = c.categoryID
JOIN supplier s ON p.supplierID = s.supplierID
WHERE p.active = 'yes';
`,
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
  DBconnect.query("SELECT supplier.*, user.email FROM supplier JOIN user ON supplier.userID = user.userID;", (err, results) => {
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
  l.loadingID, 
  l.total_value, 
  l.repID, 
  l.vehicleID, 
  l.date, 
  l.userID, 
  l.loading_status,
  lp.productID, 
  lp.quantity,
  p.product_name,
  u.firstname AS rep_firstname,
  v.vehicle_number,  -- Select vehicle_number from the vehicle table
  a.area  -- Select area from the area table
FROM 
  loading l
JOIN 
  loading_products lp ON l.loadingID = lp.loadingID
JOIN 
  product p ON lp.productID = p.productID
JOIN 
  salesrep s ON l.repID = s.repID
JOIN 
  user u ON s.userID = u.userID
JOIN 
  vehicle v ON l.vehicleID = v.vehicleID  -- Join with the vehicle table
JOIN 
  area a ON l.areaID = a.areaID  -- Join with the area table
ORDER BY 
  l.loadingID DESC;

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
  const repID = req.params.repID;
  console.log(repID);

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
  l.loading_status = 'pending'
  AND l.repID = ?;

  `;

  DBconnect.query(selectAllQuery, [repID], (err, results) => {
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

const getRepID = (req, res) => {
  const userID = req.params.userID;
  console.log(userID);

  DBconnect.query(
    "SELECT repID FROM salesrep WHERE userID = ?",
    [userID],
    (err, results) => {
      if (err) {
        console.error("Error querying MySQL database:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (results.length === 0) {
        console.warn(
          "No data found in salesrep table for the provided userID:",
          userID
        );
        res.status(404).send("No data found");
        return;
      }

      // Assuming there's only one repID per userID, you might want to send just the repID
      const repID = results[0].repID;
      //console.log(repID);
      res.json(repID);
    }
  );
};

const getCustomerID = (req, res) => {
  const userID = req.params.userID;
  console.log(userID);

  DBconnect.query(
    "SELECT customerID FROM customer WHERE userID = ?",
    [userID],
    (err, results) => {
      if (err) {
        console.error("Error querying MySQL database:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (results.length === 0) {
        console.warn(
          "No data found in salesrep table for the provided userID:",
          userID
        );
        res.status(404).send("No data found");
        return;
      }

      // Assuming there's only one repID per userID, you might want to send just the repID
      const customerID = results[0].customerID;
      console.log(customerID);
      res.json(customerID);
    }
  );
};

const getPreOrder = (req, res) => {
  // Fetch all rows from the loading table with joined data from loading_products and product tables
  const selectAllQuery = `
  SELECT 
  po.preorderID, 
  po.total_value, 
  po.customerID, 
  po.date, 
  po.pre_order_status,
  pop.productID, 
  pop.quantity,
  p.product_name,
  c.userID,
  u.firstname AS customer_firstname,
  c.areaID,
  a.area,
  c.shop_name
FROM pre_order po
JOIN pre_order_products pop ON po.preorderID = pop.preorderID
JOIN product p ON pop.productID = p.productID
JOIN customer c ON po.customerID = c.customerID
JOIN user u ON c.userID = u.userID
JOIN area a ON c.areaID = a.areaID -- Join with area table
ORDER BY po.preorderID DESC;


`;

  DBconnect.query(selectAllQuery, (err, loadingResults) => {
    if (err) {
      console.error("Error querying MySQL database for pre order table:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Fetch the latest loadingID
    const latestLoadingIDQuery =
      "SELECT preorderID FROM pre_order ORDER BY preorderID DESC LIMIT 1";
    DBconnect.query(latestLoadingIDQuery, (err, latestLoadingIDResult) => {
      if (err) {
        console.error(
          "Error querying MySQL database for latest preorderID:",
          err
        );
        res.status(500).send("Internal Server Error");
        return;
      }

      const uniqueloadingID =
        latestLoadingIDResult.length === 0
          ? 0
          : latestLoadingIDResult[0].preorderID;

      res.json({ uniqueloadingID, loadingResults });
    });
  });
};

const getPreOrderTotal = (req, res) => {
  const { areaID } = req.query;

  if (!areaID) {
    return res.status(400).json({ message: 'areaID is required' });
  }

  const query = `
    SELECT 
      pop.productID,
      p.product_name,
      ROUND(SUM(pop.quantity), 3) AS total_quantity,
      s.supplier_company
    FROM pre_order_products pop
    JOIN product p ON pop.productID = p.productID
    JOIN supplier s ON p.supplierID = s.supplierID
    JOIN pre_order po ON pop.preorderID = po.preorderID
    JOIN customer c ON po.customerID = c.customerID
    WHERE po.pre_order_status = 'pending'
      AND c.areaID = ? 
    GROUP BY pop.productID, p.product_name, s.supplier_company
    ORDER BY total_quantity DESC;
  `;

  DBconnect.query(query, [areaID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
};

const getUser = (req, res) => {
  const query = "SELECT * FROM user WHERE active = 'yes' ";

  DBconnect.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(200).send("No data in user table");
    } else {
      res.json(results);
    }
  });
};

const getSales = (req, res) => {
  const query = `SELECT 
  s.*, 
  ps.productID, 
  ps.quantity, 
  p.product_name, 
  u.firstname AS user_firstname, 
  u.lastname AS user_lastname, 
  c.shop_name, 
  a.area,  -- Changed to a.area to reflect the join with area table
  cs.cash_amount, 
  cs.balance AS cash_balance,
  chs.cheque_value,
  crs.credit_amount
FROM sale s
JOIN productsale ps ON s.saleID = ps.saleID
JOIN product p ON ps.productID = p.productID
JOIN user u ON s.userID = u.userID
JOIN customer c ON s.customerID = c.customerID
JOIN area a ON c.areaID = a.areaID  -- Join customer with area to get area information
LEFT JOIN payment pm ON s.saleID = pm.saleID
LEFT JOIN cash_sale cs ON pm.paymentID = cs.paymentID
LEFT JOIN cheque_sale chs ON pm.paymentID = chs.paymentID
LEFT JOIN credit_sale crs ON pm.paymentID = crs.paymentID
ORDER BY s.saleID DESC;




`;

  DBconnect.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(200).send("No data in sale table");
    } else {
      res.json(results);
    }
  });
};

const getCreditSales = (req, res) => {
  const query = `
  
SELECT 
    cs.credit_saleID, 
    cs.paymentID, 
    cs.credit_amount, 
    s.*, 
    u.firstname, 
    u.lastname, 
    c.shop_name, 
    a.area,  -- Changed to a.area to reflect the join with area table
    p.payment_status
FROM 
    credit_sale cs
INNER JOIN 
    payment p ON cs.paymentID = p.paymentID
INNER JOIN 
    sale s ON p.saleID = s.saleID
INNER JOIN 
    user u ON s.userID = u.userID
INNER JOIN 
    customer c ON s.customerID = c.customerID
INNER JOIN 
    area a ON c.areaID = a.areaID  -- Join customer with area to get area information
;






`;

  DBconnect.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(200).send("No data in sale table");
    } else {
      res.json(results);
    }
  });
};

const getUserbyID = (req, res) => {
  userID = req.params.editUserID;
  console.log(userID);
  const query = "SELECT * FROM user WHERE userID = ?";

  DBconnect.query(query, [userID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(200).send("No data in user table");
    } else {
      res.json(results);
    }
  });
};

const getUserbyIDdel = (req, res) => {
  userID = req.params.deleteUserID;
  console.log(userID);
  const query = "SELECT * FROM user WHERE userID = ?";

  DBconnect.query(query, [userID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(200).send("No data in user table");
    } else {
      console.log(results);
      res.json(results);
    }
  });
};

const getPaymentStatus = (req, res) => {
  const paymentID = req.params.paymentID;
  console.log(paymentID);
  
  const query = `
    SELECT p.payment_status, p.saleID, p.customerID, cs.credit_amount
    FROM payment p
    JOIN credit_sale cs ON p.paymentID = cs.paymentID
    WHERE p.paymentID = ?
  `;

  DBconnect.query(query, [paymentID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("No data found");
    } else {
      res.json(results[0]); // Return the first result as an object
    }
  });
};

const getArea = (req, res) => {
  const query = "SELECT * FROM area";

  DBconnect.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(200).send("No data in area table");
    } else {
      res.json(results);
    }
  });
};

const getProductStocks = (req, res) => {
  const { productIDs } = req.body;

  if (!Array.isArray(productIDs) || productIDs.length === 0) {
    return res.status(400).json({ message: 'Invalid product IDs' });
  }

  const query = `
    SELECT productID, stock_total
    FROM product 
    WHERE productID IN (?)
  `;

  DBconnect.query(query, [productIDs], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(results);
    res.json(results);
  });
};

const getProductStocksLoading = (req, res) => {
  const { loadingId, productIDs } = req.body;

  console.log(loadingId, productIDs);

  if (!loadingId || !Array.isArray(productIDs) || productIDs.length === 0) {
    return res.status(400).json({ message: 'Invalid loading ID or product IDs' });
  }

  const query = `
    SELECT productID, quantity
    FROM loading_products
    WHERE loadingID = ?
  `;

  DBconnect.query(query, [loadingId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Create a map to store quantities by product ID
    const quantityMap = {};
    results.forEach((row) => {
      quantityMap[row.productID] = row.quantity;
    });

    // Filter the quantities based on the product IDs provided
    const response = productIDs.map((productID) => ({
      productID,
      stock_total: quantityMap[productID] || 0, // Default quantity to 0 if not found
    }));

    res.json(response);
  });
};


const getStockRequests = (req, res) => {
  const query = `
    SELECT 
      sr.requestID, 
      sr.supplierID, 
      sr.date, 
      sr.notes,
      rp.productID, 
      rp.quantity,
      p.product_name,
      s.supplier_company
    FROM 
      stock_request sr
    JOIN 
      request_products rp ON sr.requestID = rp.requestID
    JOIN 
      product p ON rp.productID = p.productID
    JOIN 
      supplier s ON sr.supplierID = s.supplierID
    ORDER BY 
      sr.requestID DESC;
  `;

  DBconnect.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query(query, (err, results) => {
      connection.release();
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
  });
};

const getLoadingStatus = (req, res) => {
  const { repID } = req.params;
  console.log(repID);

  // Query to get the latest loading status from the loading table for the given repID
  const selectLoadingStatusQuery = `
    SELECT 
      loading_status 
    FROM 
      loading 
    WHERE 
      repID = ?
    ORDER BY 
      loadingID DESC  -- Ordering by loadingID in descending order
    LIMIT 1
  `;

  DBconnect.query(selectLoadingStatusQuery, [repID], (err, loadingResults) => {
    if (err) {
      console.error("Error querying MySQL database for loading status:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Check if there is a result
    if (loadingResults.length > 0) {
      // Get the loading status from the first (and only) result
      const loadingStatus = loadingResults[0].loading_status;
      
      // Check if the loading status is 'pending'
      const hasPendingStatus = loadingStatus === "pending";

      console.log(hasPendingStatus);
      
      // Respond with true if there is a pending loading status, otherwise false
      res.json({ hasPendingStatus });
    } else {
      // If there are no results, respond with false
      res.json({ hasPendingStatus: false });
    }
  });
};

const getSalesChart = (req, res) => {
  const query = `SELECT DATE(date) AS date, SUM(sale_amount) AS sale_amount
FROM sale
WHERE date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
GROUP BY DATE(date)
ORDER BY date DESC;


`;

  DBconnect.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(200).send("No data in sale table");
    } else {
      res.json(results);
    }
  });
};

const getTopSales = (req, res) => {
  const query = `SELECT 
    ps.productID, 
    p.product_name, 
    SUM(ps.quantity) AS total_quantity
FROM 
    productsale ps
JOIN 
    product p ON ps.productID = p.productID
GROUP BY 
    ps.productID, 
    p.product_name
ORDER BY 
    total_quantity DESC
LIMIT 5;

`;

  DBconnect.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(200).send("No data in sale table");
    } else {
      res.json(results);
    }
  });
};

const getProductChart = (req, res) => {
  const query = 'SELECT productID, product_name, stock_total FROM product';
  DBconnect.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching product data:', err);
      res.status(500).json({ error: 'Failed to fetch product data' });
      return;
    }
    res.json(results);
  });
};

const getBestArea = (req, res) => {
  // Execute the SQL query
  DBconnect.query(
    'SELECT a.areaID, a.area, SUM(s.sale_amount) AS total_sale_amount FROM sale s JOIN customer c ON s.customerID = c.customerID JOIN area a ON c.areaID = a.areaID GROUP BY a.areaID, a.area ORDER BY total_sale_amount DESC LIMIT 1',
    (error, results, fields) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      // Send the area with the highest total sale_amount to the frontend
      res.json(results[0]);
    }
  );
};

const getTotalofMonth = (req, res) => {
  const query = `
    SELECT SUM(sale_amount) AS total_amount
    FROM sale
    WHERE MONTH(date) = MONTH(CURRENT_DATE())
      AND YEAR(date) = YEAR(CURRENT_DATE());
  `;

  DBconnect.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ total_amount: result[0].total_amount });
  });
};


const getTotalCounts = (req, res) => {
  const queryEmployees = 'SELECT COUNT(*) AS total_employees FROM `user` WHERE `usertypeID` NOT IN (5, 6)';
  const queryCustomers = 'SELECT COUNT(*) AS total_customers FROM `user` WHERE `usertypeID` = 6';

  DBconnect.query(queryEmployees, (errorEmployees, resultsEmployees) => {
    if (errorEmployees) throw errorEmployees;
    const totalEmployees = resultsEmployees[0].total_employees;

    DBconnect.query(queryCustomers, (errorCustomers, resultsCustomers) => {
      if (errorCustomers) throw errorCustomers;
      const totalCustomers = resultsCustomers[0].total_customers;

      res.json({ totalEmployees, totalCustomers });
    });
  });
};

const paymentLog = (req, res) => {
  const query = `
    SELECT pl.*, c.shop_name 
    FROM payment_log pl
    JOIN customer c ON pl.customerID = c.customerID
  `;

  // Get a connection from the pool
  DBconnect.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data from payment_log:', error);
      return res.status(500).json({ message: 'Error fetching data from payment_log' });
    }

    // Successfully fetched data
    res.status(200).json(results);
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
  getRepID,
  getCustomerID,
  getPreOrder,
  getPreOrderTotal,
  getUser,
  getUserbyID,
  getSales,
  getCreditSales,
  getPaymentStatus,
  getArea,
  getProductStocks,
  getStockRequests,
  getProductStocksLoading,
  getUserbyIDdel,
  getLoadingStatus,
  getSalesChart,
  getTopSales,
  getProductChart,
  getBestArea,
  getTotalofMonth,
  getTotalCounts,
  paymentLog,
};
