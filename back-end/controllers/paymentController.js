const DBconnect = require('../config/DBconnect');



const updatePaymentStatus = (req, res) => {
  const paymentID = req.params.paymentID;
  console.log(paymentID);

  const date = new Date().toISOString().slice(0, 19).replace("T", " "); // Current date and time

  // First, retrieve payment_type and customerID based on paymentID
  const retrieveQuery = `
    SELECT payment_type, customerID, saleID 
    FROM payment 
    WHERE paymentID = ?
  `;

  DBconnect.query(retrieveQuery, [paymentID], (error, results) => {
    if (error) {
      console.error('Error retrieving payment information:', error);
      return res.status(500).json({ message: 'Error retrieving payment information' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const { payment_type, customerID, saleID } = results[0];
    const amountQuery = `
      SELECT sale_amount 
      FROM sale 
      WHERE saleID = ?
    `;

    DBconnect.query(amountQuery, [saleID], (error, results) => {
      if (error) {
        console.error('Error retrieving sale amount:', error);
        return res.status(500).json({ message: 'Error retrieving sale amount' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Sale not found' });
      }

      const { sale_amount } = results[0];

      // Now, update the payment status
      const updateQuery = `
        UPDATE payment 
        SET payment_status = 'fully paid'
        WHERE paymentID = ?
      `;

      DBconnect.query(updateQuery, [paymentID], (error, updateResults) => {
        if (error) {
          console.error('Error updating payment status:', error);
          return res.status(500).json({ message: 'Error updating payment status' });
        }

        // Insert data into payment_log table
        const insertQuery = `
          INSERT INTO payment_log (payment_type, amount, customerID, date) 
          VALUES (?, ?, ?, ?)
        `;
        const logValues = ['cash', sale_amount, customerID, date];

        DBconnect.query(insertQuery, logValues, (error, logResults) => {
          if (error) {
            console.error('Error inserting into payment_log:', error);
            return res.status(500).json({ message: 'Error inserting into payment_log' });
          }

          // Successfully updated payment status and inserted into payment_log
          res.status(200).json({
            message: 'Payment status updated and logged successfully',
            paymentID: paymentID
          });
        });
      });
    });
  });
};



const deductCreditAmount = (req, res) => {
  const date = new Date().toISOString().slice(0, 19).replace("T", " "); // Current date and time
  const paymentID = req.params.paymentID;
  const { paymentAmount } = req.body;

  // Start a transaction
  DBconnect.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction: ", err);
        connection.release(); // Release the connection back to the pool
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      // Update the credit_amount in the credit_sale table
      const updateCreditAmountQuery = `
        UPDATE credit_sale
        SET credit_amount = credit_amount - ?
        WHERE paymentID = ? AND credit_amount >= ?
      `;

      connection.query(updateCreditAmountQuery, [paymentAmount, paymentID, paymentAmount], (error, results) => {
        if (error) {
          console.error('Error updating credit amount:', error);
          return connection.rollback(() => {
            connection.release(); // Release the connection back to the pool
            res.status(500).json({ message: 'Error updating credit amount' });
          });
        }

        if (results.affectedRows === 0) {
          // No rows were updated, possibly due to insufficient credit_amount
          return connection.rollback(() => {
            connection.release(); // Release the connection back to the pool
            res.status(400).json({ message: 'Insufficient credit amount or invalid paymentID' });
          });
        }

        // Retrieve payment_type and customerID based on paymentID
        const retrieveQuery = `
          SELECT payment_type, customerID
          FROM payment
          WHERE paymentID = ?
        `;

        connection.query(retrieveQuery, [paymentID], (error, results) => {
          if (error) {
            console.error('Error retrieving payment information:', error);
            return connection.rollback(() => {
              connection.release(); // Release the connection back to the pool
              res.status(500).json({ message: 'Error retrieving payment information' });
            });
          }

          if (results.length === 0) {
            return connection.rollback(() => {
              connection.release(); // Release the connection back to the pool
              res.status(404).json({ message: 'Payment not found' });
            });
          }

          const { customerID } = results[0];

          // Insert data into payment_log table
          const insertQuery = `
            INSERT INTO payment_log (payment_type, amount, customerID, date)
            VALUES (?, ?, ?, ?)
          `;
          const logValues = ['cash', paymentAmount, customerID, date];

          connection.query(insertQuery, logValues, (error, logResults) => {
            if (error) {
              console.error('Error inserting into payment_log:', error);
              return connection.rollback(() => {
                connection.release(); // Release the connection back to the pool
                res.status(500).json({ message: 'Error inserting into payment_log' });
              });
            }

            // Successfully deducted paymentAmount from credit_amount and logged the payment
            connection.commit((err) => {
              if (err) {
                console.error('Error committing transaction: ', err);
                return connection.rollback(() => {
                  connection.release(); // Release the connection back to the pool
                  res.status(500).json({ message: 'Error committing transaction' });
                });
              }

              connection.release(); // Release the connection back to the pool
              res.status(200).json({ message: 'Credit amount deducted and logged successfully' });
            });
          });
        });
      });
    });
  });
};



module.exports = {
  updatePaymentStatus,
  deductCreditAmount,
};
