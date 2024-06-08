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
const {getVehicle} = require('../controllers/getController');
const {getLoadingProducts} = require('../controllers/getController');
const {getRepID} = require('../controllers/getController');
const {getCustomerID} = require('../controllers/getController');
const {getPreOrder} = require('../controllers/getController');
const {getPreOrderTotal} = require('../controllers/getController');
const {getUser} = require('../controllers/getController');
const {getUserbyID} = require('../controllers/getController');
const {getSales} = require('../controllers/getController');
const {getCreditSales} = require('../controllers/getController');


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
router.get('/getvehicle', getVehicle);
router.get('/getloadingproducts/:repID', getLoadingProducts);
router.get('/getrepID/:userID', getRepID);
router.get('/getcustomerID/:userID', getCustomerID);
router.get('/getpreorder', getPreOrder);
router.get('/getpreordertotal', getPreOrderTotal);
router.get('/getuser', getUser);
router.get('/getuser/:editUserID', getUserbyID);
router.get('/getsales', getSales);
router.get('/getcreditsales', getCreditSales);

module.exports = router;

