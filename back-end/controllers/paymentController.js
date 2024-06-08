const DBconnect = require('../config/DBconnect');



const updatePaymentStatus = (req, res) => {
    const paymentID = req.params.paymentID;
    console.log(paymentID);
    // Construct the SQL query to update payment status
    const updateQuery = `
      UPDATE payment 
      SET payment_status = 'fully paid'
      WHERE paymentID = ?
    `;
  
    // Data to update payment status
    
  
    // Execute the query to update payment status
    DBconnect.query(updateQuery, [paymentID], (error, results) => {
      if (error) {
        console.error('Error updating payment status:', error);
        return res.status(500).json({ message: 'Error updating payment status' });
      }
  
      // Successfully updated payment status
      res.status(200).json({
        message: 'Payment added and status updated successfully',
        paymentID: paymentID // Return the auto-incremented paymentID
      });
    });
  };


  const deductCreditAmount = (req, res) => {
    const paymentID = req.params.paymentID;
  const { paymentAmount } = req.body;

  // Update the credit_amount in the credit_sale table and deduct the paymentAmount
  const updateCreditAmountQuery = `
    UPDATE credit_sale
    SET credit_amount = credit_amount - ?
    WHERE paymentID = ? AND credit_amount >= ?
  `;

  DBconnect.query(updateCreditAmountQuery, [paymentAmount, paymentID, paymentAmount], (error, results) => {
    if (error) {
      console.error('Error updating credit amount:', error);
      return res.status(500).json({ message: 'Error updating credit amount' });
    }

    if (results.affectedRows === 0) {
      // No rows were updated, possibly due to insufficient credit_amount
      return res.status(400).json({ message: 'Insufficient credit amount or invalid paymentID' });
    }

    // Successfully deducted paymentAmount from credit_amount
    res.status(200).json({ message: 'Credit amount deducted successfully' });
  });
};



module.exports = {
  updatePaymentStatus,
  deductCreditAmount,
};
