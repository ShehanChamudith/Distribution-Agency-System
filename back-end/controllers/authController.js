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
WHERE user.username = ? AND user.password = ? AND user.active = 'yes';
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

module.exports = {
  login,
  verifyPassword,
};
