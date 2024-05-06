const DBconnect = require('../config/DBconnect');

const addItem = (req, res) => {

    const { product_name, stock_total, categoryID, wholesale_price, selling_price, date_added } = req.body;
    
    const insertQuery = 'INSERT INTO product (product_name, stock_total, categoryID, wholesale_price, selling_price, date_added) VALUES (?, ?, ?, ?, ?, ?)';

    DBconnect.query(insertQuery, [product_name, stock_total, categoryID, wholesale_price, selling_price, date_added], (err, result) => {
        if (err) {
            console.error('Error inserting user into database:', err);
            res.status(500).send('Internal Server Error');
            return;
        } 

        res.json({ message: 'Item added successfully' }); // Send response indicating successful user addition
        
    });

}


module.exports = {
    addItem
    
};