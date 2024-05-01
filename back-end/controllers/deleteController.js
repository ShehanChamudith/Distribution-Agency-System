const DBconnect = require('../config/DBconnect');

const deleteInventory = (req, res) => {
    const productID = req.body.rowIdToDelete;
    DBconnect.query('DELETE * FROM product where productID = ?', productID, (err, results) => {
        if (error) {
            console.error("Error deleting item:", error);
            res.status(500).json({ error: "Error deleting item" });
          } else {
            console.log("Item deleted successfully");
            res.status(200).json({ message: "Item deleted successfully" });
          }
    });
}

module.exports = {
    deleteInventory
};
