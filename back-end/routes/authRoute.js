const express = require('express');
const router = express.Router();
const {login} = require('../controllers/authController');
const {verifyPassword} = require('../controllers/authController');

router.post("/", login);
router.post("/verifypassword", verifyPassword);

module.exports = router;

