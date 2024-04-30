const express = require('express');
const router = express.Router();
const {inventoryGet} = require('../controllers/getController');

router.get("/inventory", inventoryGet);


module.exports = router;

