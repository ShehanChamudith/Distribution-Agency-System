const express = require('express');
const router = express.Router();
const {login} = require('../controllers/authController');
const {verifyPassword} = require('../controllers/authController');
const {addArea} = require('../controllers/authController');
const {deactivateArea} = require('../controllers/authController');
const {editArea} = require('../controllers/authController');

router.post("/", login);
router.post("/verifypassword", verifyPassword);
router.post("/addarea", addArea);
router.put("/deletearea/:areaID", deactivateArea);
router.put("/editarea/:areaID", editArea);

module.exports = router;

