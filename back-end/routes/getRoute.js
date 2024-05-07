const express = require('express');
const router = express.Router();
const {inventoryGet} = require('../controllers/getController');
const {categoryGet} = require('../controllers/getController');
const {getItem} = require('../controllers/getController');
const {getCategory} = require('../controllers/getController');

router.get("/inventory", inventoryGet);
router.get("/category", categoryGet);
router.get('/editItemDataGet/:productId', getItem);
router.get('/editItemCategoryGet/:productId', getCategory);


module.exports = router;

