const DBconnect = require('../config/DBconnect');

const deleteInventory = (req, res) => {
    const productId = req.params.productId;
    const sql = 'DELETE FROM product WHERE productID = ?';
  
    DBconnect.query(sql, [productId], (err, result) => {
      if (err) {
        console.error('Error deleting row:', err);
        res.status(500).json({ error: 'An error occurred while deleting the row' });
        return;
      }
      console.log('Row deleted successfully');
      res.status(200).json({ message: 'Row deleted successfully' });
    });
}

module.exports = {
    deleteInventory
};
