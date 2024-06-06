const express = require('express');
const router = express.Router();

const {addPreOrder} = require('../controllers/preOrderController');

router.post("/addpreorder", addPreOrder);


module.exports = router;