const express = require('express');
const router = express.Router();
const {addSale} = require('../controllers/saleController');

router.post("/addsale", addSale);

module.exports = router;