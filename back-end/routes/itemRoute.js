const express = require('express');
const router = express.Router();
const {deleteItem} = require('../controllers/itemController');
const {addItem} = require('../controllers/itemController');
const {updateItem} = require('../controllers/itemController');

router.delete('/deleteItem/:productId', deleteItem);
router.post("/additem", addItem);
router.put("/edititem/:productId", updateItem);


module.exports = router;

