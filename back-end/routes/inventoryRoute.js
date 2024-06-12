const express = require('express');
const router = express.Router();
const {addInventory} = require('../controllers/inventoryController');
const {deleteStock} = require('../controllers/inventoryController');
const {updateStock} = require('../controllers/inventoryController');

router.post('/addstock', addInventory);
router.delete('/deletestock/:inventoryID', deleteStock);
router.put('/updatestock/:id', updateStock);

module.exports = router;