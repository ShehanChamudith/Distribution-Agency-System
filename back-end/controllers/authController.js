const DBconnect = require("../config/DBconnect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login Function
const login = (req, res) => {
  const { username, password } = req.body;

  DBconnect.query(
    `SELECT user.*, usertype.usertype_name
FROM user
JOIN usertype ON user.usertypeID = usertype.usertypeID
WHERE BINARY user.username = ? AND BINARY user.password = ? AND user.active = 'yes';
`,
    [username, password],
    (err, rows) => {
      if (err) {
        console.error("Error querying MySQL database:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (rows.length === 1) {
        const {
          username,
          userID,
          usertypeID,
          firstname,
          lastname,
          usertype_name,
        } = rows[0];
        const accessToken = jwt.sign(
          { username, userID, usertypeID, firstname, lastname, usertype_name },
          "jwtSecretToken"
        );

        res.json({ accessToken });
      } else {
        res.json({ error: "Invalid username or password" });
      }
    }
  );
};
const verifyPassword = (req, res) => {
  const { password } = req.body;
  const query = "SELECT password FROM user WHERE usertypeID = 1 LIMIT 1";

  console.log(password);

  DBconnect.query(query, (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database query error" });
    }

    if (result.length === 0) {
      console.warn("No admin found");
      return res
        .status(401)
        .json({ success: false, message: "No admin found" });
    }

    const adminPassword = result[0].password;
    console.log(adminPassword);

    // Directly compare the entered password with the stored password
    if (password === adminPassword) {
      return res.json({ success: true });
    } else {
      console.warn("Invalid password");
      return res.json({ success: false, message: "Invalid password" });
    }
  });
};

const addArea = (req, res) => {
  const { area } = req.body;

  // Check if the area name is provided
  if (!area || area.trim() === '') {
    return res.status(400).json({ message: 'Area Name cannot be empty' });
  }

  const checkQuery = 'SELECT * FROM area WHERE area = ?';
  DBconnect.query(checkQuery, [area.trim()], (err, existingAreas) => {
    if (err) {
      console.error('Error checking area in the database:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (existingAreas.length > 0) {
      // Area already exists, return a 409 status code
      return res.status(409).json({ message: 'Area already exists' });
    }

    const insertQuery = 'INSERT INTO area (area, availability,active) VALUES (?, "yes","yes")';
    DBconnect.query(insertQuery, [area.trim()], (err, result) => {
      if (err) {
        console.error('Error inserting area into the database:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (result.affectedRows === 1) {
        return res.status(201).json({ message: 'Area added successfully' });
      } else {
        return res.status(500).json({ message: 'Failed to add area' });
      }
    });
  });
};

const deactivateArea = (req, res) => {
  const { areaID } = req.params;
  

  // Check if the areaID is provided
  if (!areaID) {
      return res.status(400).json({ message: 'Area ID is required' });
  }

  const updateQuery = 'UPDATE area SET active = "no" WHERE areaID = ?';
  DBconnect.query(updateQuery, [areaID], (err, result) => {
      if (err) {
          console.error('Error updating area in the database:', err);
          return res.status(500).send('Internal Server Error');
      }

      if (result.affectedRows === 1) {
          return res.status(200).json({ message: 'Area deactivated successfully' });
      } else {
          return res.status(404).json({ message: 'Area not found' });
      }
  });
};

const editArea = (req, res) => {
  const areaID = req.params.areaID;
  const { area_name } = req.body;

  // Check if the area name is provided
  if (!area_name || area_name.trim() === '') {
    return res.status(400).json({ message: 'Area Name cannot be empty' });
  }

  const checkQuery = 'SELECT * FROM area WHERE area = ? AND areaID != ?';
  DBconnect.query(checkQuery, [area_name.trim(), areaID], (err, existingAreas) => {
    if (err) {
      console.error('Error checking area in the database:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (existingAreas.length > 0) {
      // Area with the same name already exists, return a 409 status code
      return res.status(409).json({ message: 'Area with the same name already exists' });
    }

    // SQL UPDATE query
    const updateQuery = 'UPDATE area SET area = ? WHERE areaID = ?';

    DBconnect.query(updateQuery, [area_name, areaID], (err, result) => {
      if (err) {
        console.error('Error updating area in the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      } 
      res.json({ message: 'Area updated successfully' }); // Send response indicating successful update
    });
  });
};





module.exports = {
  login,
  verifyPassword,
  addArea,
  deactivateArea,
  editArea,
};
