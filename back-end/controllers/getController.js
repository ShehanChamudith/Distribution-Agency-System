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

module.exports = {
    inventoryGet,
    categoryGet
};

