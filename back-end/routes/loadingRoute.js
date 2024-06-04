const express = require('express');
const router = express.Router();

const {addLoading} = require('../controllers/loadingController');
const {checkPendingLoading} = require('../controllers/loadingController');
const {updateLoadingStatus} = require('../controllers/loadingController');

router.post("/addloading", addLoading);
router.post("/check-pending-loading", checkPendingLoading);
router.put("/update-loading-status", updateLoadingStatus);

module.exports = router;