const express = require('express');
const router = express.Router();

const {addLoading} = require('../controllers/loadingController');
const {checkPendingLoading} = require('../controllers/loadingController');
const {updateLoadingStatus} = require('../controllers/loadingController');
const {getLoadingById} = require('../controllers/loadingController');
const {editLoading} = require('../controllers/loadingController');
const {addLoadingPreOrders} = require('../controllers/loadingController');

router.post("/addloading", addLoading);
router.post("/check-pending-loading", checkPendingLoading);
router.put("/update-loading-status", updateLoadingStatus);
router.get("/getloadingID/:loadingID", getLoadingById);
router.post("/edit-loading", editLoading);
router.post("/addloading-pre-orders", addLoadingPreOrders);


module.exports = router;