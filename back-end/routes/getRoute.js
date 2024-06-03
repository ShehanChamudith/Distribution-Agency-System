const express = require('express');
const router = express.Router();
const {inventoryGet} = require('../controllers/getController');
const {categoryGet} = require('../controllers/getController');
const {getItem} = require('../controllers/getController');
const {getCategory} = require('../controllers/getController');
const {getStock} = require('../controllers/getController');
const {getSupplier} = require('../controllers/getController');
const {getCustomer} = require('../controllers/getController');
const {getSale} = require('../controllers/getController');
const {getSalesRep} = require('../controllers/getController');
const {getLoading} = require('../controllers/getController');

router.get("/inventory", inventoryGet);
router.get("/category", categoryGet);
router.get('/editItemDataGet/:productId', getItem);
router.get('/editItemCategoryGet/:productId', getCategory);
router.get('/getstock', getStock);
router.get('/getsupplier', getSupplier);
router.get('/getcustomer', getCustomer);
router.get('/getsale', getSale);
router.get('/getsalerep', getSalesRep);
router.get('/getloading', getLoading);


module.exports = router;

