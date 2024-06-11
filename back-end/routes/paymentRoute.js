const express = require('express');
const router = express.Router();

const {updatePaymentStatus} = require('../controllers/paymentController');
const {deductCreditAmount} = require('../controllers/paymentController');

router.post("/updatepayment/:paymentID", updatePaymentStatus);
router.post("/deductcreditamount/:paymentID", deductCreditAmount);

module.exports = router;