const express = require('express');
const router = express.Router();
const {deleteItem} = require('../controllers/itemController');
const {addItem} = require('../controllers/itemController');

router.delete('/deleteItem/:productId', deleteItem);
router.post("/additem", addItem);


module.exports = router;

