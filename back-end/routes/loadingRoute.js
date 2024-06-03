const express = require('express');
const router = express.Router();

const {addLoading} = require('../controllers/loadingController');

router.post("/addloading", addLoading);

module.exports = router;