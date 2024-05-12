const DBconnect = require('../config/DBconnect');


const addItem = (req, res) => {
    const { product_name, stock_total, categoryID, wholesale_price, selling_price, date_added } = req.body;
    
    // Check if req.file exists
    const imagePath = req.file ? req.file.path : null; // Path to the uploaded image, or null if no file is uploaded

    const insertQuery = 'INSERT INTO product (product_name, stock_total, categoryID, wholesale_price, selling_price, date_added, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)';

    DBconnect.query(insertQuery, [product_name, stock_total, categoryID, wholesale_price, selling_price, date_added, imagePath], (err, result) => {
        if (err) {
            console.error('Error inserting item into database:', err);
            res.status(500).send('Internal Server Error');
            return;
        } 
        res.json({ message: 'Item added successfully' }); // Send response indicating successful item addition 
    });
}




const deleteItem = (req, res) => {
    const productId = req.params.productId;
    const sql = 'DELETE FROM product WHERE productID = ?';
  
    DBconnect.query(sql, [productId], (err, result) => {
      if (err) {
        console.error('Error deleting row:', err);
        res.status(500).json({ error: 'An error occurred while deleting the row' });
        return;
      }
      console.log('Row deleted successfully');
      res.status(200).json({ message: 'Row deleted successfully', id: productId });
    });
}

const updateItem = (req, res) => {
    const productId = req.params.productId;
    const { product_name, categoryID, wholesale_price, selling_price, date_added } = req.body;

    console.log('Received data from frontend:', req.body);
    
    // SQL UPDATE query
    const updateQuery = 'UPDATE product SET product_name = ?, categoryID = ?, wholesale_price = ?, selling_price = ?, date_added = ? WHERE productID = ?';

    DBconnect.query(updateQuery, [product_name, categoryID, wholesale_price, selling_price, date_added, productId], (err, result) => {
        if (err) {
            console.error('Error updating item in the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        } 
        res.json({ message: 'Item updated successfully' }); // Send response indicating successful update
    });
}


module.exports = {
    addItem,
    deleteItem,
    updateItem,

};