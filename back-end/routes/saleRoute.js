const express = require('express');
const router = express.Router();
const {addSale} = require('../controllers/saleController');
const {addSaleDelivery} = require('../controllers/saleController');

router.post("/addsale", addSale);
router.post("/addsaledelivery", addSaleDelivery);

module.exports = router;