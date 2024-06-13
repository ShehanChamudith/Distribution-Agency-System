const express = require('express');
const router = express.Router();

const {salesReport} = require('../controllers/reportController');

router.post("/salesreport", salesReport);


module.exports = router;