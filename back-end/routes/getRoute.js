const express = require('express');
const router = express.Router();
const {inventoryGet} = require('../controllers/getController');
const {categoryGet} = require('../controllers/getController');

router.get("/inventory", inventoryGet);
router.get("/category", categoryGet);


module.exports = router;

