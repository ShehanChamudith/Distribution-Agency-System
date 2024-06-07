const express = require('express');
const router = express.Router();

const {addPreOrder} = require('../controllers/preOrderController');
const {getPreOrderTotalToLoad} = require('../controllers/preOrderController');

router.post("/addpreorder", addPreOrder);
router.get("/load-preorders", getPreOrderTotalToLoad);


module.exports = router;