const express = require('express');
const router = express.Router();
const {deleteInventory} = require('../controllers/deleteController');

router.delete('/inventory/:productId', deleteInventory);


module.exports = router;

