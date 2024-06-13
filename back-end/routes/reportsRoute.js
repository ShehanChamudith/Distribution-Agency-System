const express = require('express');
const router = express.Router();

const {salesReport} = require('../controllers/reportController');
const {inventoryReport} = require('../controllers/reportController');

router.post("/salesreport", salesReport);
router.post("/inventoryreport", inventoryReport);


module.exports = router;