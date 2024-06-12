const DBconnect = require("../config/DBconnect");
const bcrypt = require("bcrypt");

const addUser = (req, res) => {
  const {
    userID,
    usertypeID,
    username,
    password,
    firstname,
    lastname,
    email,
    phone,
    address,
    areaID,
    shop_name,
    supplier_company,
  } = req.body;

  const handlePasswordHashing = (callback) => {
    if (password) {
      bcrypt.genSalt(10, (saltErr, salt) => {
        if (saltErr) {
          console.error("Error generating salt:", saltErr);
          res.status(500).send("Internal Server Error");
          return;
        }

        bcrypt.hash(password, salt, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error("Error hashing password:", hashErr);
            res.status(500).send("Internal Server Error");
            return;
          }

          callback(hashedPassword);
        });
      });
    } else {
      callback(null);
    }
  };

  handlePasswordHashing((hashedPassword) => {
    if (userID) {
      // Update existing user
      const updateUserQuery =
        "UPDATE user SET usertypeID = ?, username = ?, password = COALESCE(?, password), firstname = ?, lastname = ?, email = ?, phone = ?, address = ? WHERE userID = ?";

      DBconnect.query(
        updateUserQuery,
        [
          usertypeID,
          username,
          hashedPassword,
          firstname,
          lastname,
          email,
          phone,
          address,
          userID,
        ],
        (err, result) => {
          if (err) {
            console.error("Error updating user:", err);
            res.status(500).send("Internal Server Error");
            return;
          }

          if (usertypeID === 6 && (areaID || shop_name)) {
            const updateCustomerQuery =
              "UPDATE customer SET areaID = ?, shop_name = ? WHERE userID = ?";
            DBconnect.query(
              updateCustomerQuery,
              [areaID, shop_name, userID],
              (customerErr, customerResult) => {
                if (customerErr) {
                  console.error("Error updating customer:", customerErr);
                  res.status(500).send("Internal Server Error");
                  return;
                }

                res.json({ message: "User and customer updated successfully" });
              }
            );
          } else if (usertypeID === 5 && supplier_company) {
            const updateSupplierQuery =
              "UPDATE supplier SET supplier_company = ? WHERE userID = ?";
            DBconnect.query(
              updateSupplierQuery,
              [supplier_company, userID],
              (supplierErr, supplierResult) => {
                if (supplierErr) {
                  console.error("Error updating supplier:", supplierErr);
                  res.status(500).send("Internal Server Error");
                  return;
                }

                res.json({ message: "User and supplier updated successfully" });
              }
            );
          } else {
            res.json({ message: "User updated successfully" });
          }
        }
      );
    } else {
      // Insert new user
      const insertUserQuery = `INSERT INTO user (usertypeID, username, password, firstname, lastname, email, phone, address, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'yes');`;

      DBconnect.query(
        insertUserQuery,
        [
          usertypeID,
          username,
          hashedPassword,
          firstname,
          lastname,
          email,
          phone,
          address,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting user into database:", err);
            res.status(500).send("Internal Server Error");
            return;
          }

          const userID = result.insertId;

          if (usertypeID === 6) {
            const insertCustomerQuery =
              "INSERT INTO customer (userID, areaID, shop_name) VALUES (?, ?, ?)";
            DBconnect.query(
              insertCustomerQuery,
              [userID, areaID, shop_name],
              (customerErr, customerResult) => {
                if (customerErr) {
                  console.error(
                    "Error inserting customer into database:",
                    customerErr
                  );
                  res.status(500).send("Internal Server Error");
                  return;
                }

                res.json({ message: "User and customer added successfully" });
              }
            );
          } else if (usertypeID === 5) {
            const insertSupplierQuery =
              "INSERT INTO supplier (userID, supplier_company) VALUES (?, ?)";
            DBconnect.query(
              insertSupplierQuery,
              [userID, supplier_company],
              (supplierErr, supplierResult) => {
                if (supplierErr) {
                  console.error(
                    "Error inserting supplier into database:",
                    supplierErr
                  );
                  res.status(500).send("Internal Server Error");
                  return;
                }

                res.json({ message: "User and supplier added successfully" });
              }
            );
          } else {
            res.json({ message: "User added successfully" });
          }
        }
      );
    }
  });
};

const checkUserExistance = (req, res) => {
  const { userID, username, phone } = req.body;
  console.log(req.body);

  let checkUserQuery;
  let queryParams;

  if (userID) {
    // If userID is provided, exclude the current user being updated
    checkUserQuery =
      "SELECT COUNT(*) AS count FROM user WHERE (username = ? OR phone = ?) AND userID != ?";
    queryParams = [username, phone, userID];
  } else {
    // If userID is not provided, it's a new user addition
    checkUserQuery =
      "SELECT COUNT(*) AS count FROM user WHERE username = ? OR phone = ?";
    queryParams = [username, phone];
  }

  DBconnect.query(checkUserQuery, queryParams, (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // If count > 0, username or phone number already exists
    if (result[0].count > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
};

const checkUserExistance2 = (req, res) => {
  const { userID } = req.body;
 
  let checkUserQuery;
  let queryParams;

  // If userID is not provided, it's a new user addition
  checkUserQuery = "SELECT COUNT(*) AS count FROM user WHERE userID = ?";
  queryParams = [userID];

  DBconnect.query(checkUserQuery, queryParams, (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // If count > 0, username or phone number already exists
    if (result[0].count > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
};

const deleteUser = (req, res) => {
  const userID = req.params.deleteUserID;
  const sql = `UPDATE user SET active = 'no' WHERE userID = ?;`;

  DBconnect.query(sql, [userID], (err, result) => {
    if (err) {
      console.error('Error deleting row:', err);
      res.status(500).json({ error: 'An error occurred while deleting the row' });
      return;
    }
    console.log('Row deleted successfully');
    res.status(200).json({ message: 'Row updated successfully', id: userID });
  });
}

module.exports = {
  addUser,
  checkUserExistance,
  checkUserExistance2,
  deleteUser,
};
