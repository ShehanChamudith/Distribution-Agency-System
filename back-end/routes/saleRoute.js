const express = require('express');
const router = express.Router();
const {addSale} = require('../controllers/saleController');
const {addSaleDelivery} = require('../controllers/saleController');
const {addStockReq} = require('../controllers/stockReq');

router.post("/addsale", addSale);
router.post("/addsaledelivery", addSaleDelivery);
router.post("/addstockreq", addStockReq);

module.exports = router;