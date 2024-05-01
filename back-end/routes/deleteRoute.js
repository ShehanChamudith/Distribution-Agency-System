const express = require('express');
const router = express.Router();
const {deleteInventory} = require('../controllers/deleteController');

router.post("/delete/:productID", deleteInventory);


module.exports = router;

