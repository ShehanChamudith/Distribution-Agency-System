const DBconnect = require('../config/DBconnect');

const inventoryGet = (req, res) => {
    DBconnect.query('SELECT p.*, c.category FROM product p JOIN category c ON p.categoryID = c.categoryID', (err, results) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            console.warn('No data found in product table');
            res.status(404).send('No data found');
            return;
        }

        res.json(results);
    });
}

const categoryGet = (req,res) => {
    DBconnect.query('SELECT * FROM category', (err, results) => {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            console.warn('No data found in product table');
            res.status(404).send('No data found');
            return;
        }

        res.json(results);
    });

}


const getItem = (req, res) => {
    const productId = req.params.productId;
    const sql = 'SELECT * FROM product WHERE productID = ?';
  
    DBconnect.query(sql, [productId], (err, result) => {
      if (err) {
        console.error('Error getting row:', err);
        res.status(500).json({ error: 'An error occurred while getting the row' });
        return;
      }
      if (result.length === 0) {
        
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      console.log('Row fetched successfully');
      // Sending the fetched row in the response
      res.status(200).json(result[0]); // Assuming there's only one row with the given ID
    });
  };


  const getCategory = (req, res) => {
    const productId = req.params.productId;
    const sql = 'SELECT c.category FROM product p JOIN category c ON p.categoryID = c.categoryID WHERE p.productID = ?';

    DBconnect.query(sql, [productId], (err, result) => {
        if (err) {
          console.error('Error getting Category:', err);
          res.status(500).json({ error: 'An error occurred while getting the Category' });
          return;
        }
        if (result.length === 0) {
          
          res.status(404).json({ error: 'Category not found' });
          return;
        }
        console.log('Category fetched successfully');
        // Sending the fetched row in the response
        res.status(200).json(result[0]); // Assuming there's only one row with the given ID
      });
    
  };
  



module.exports = {
    inventoryGet,
    categoryGet,
    getItem,
    getCategory
};

