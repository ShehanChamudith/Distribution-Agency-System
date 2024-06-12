const express = require('express');
const router = express.Router();
const {addUser} = require('../controllers/userController');
const {checkUserExistance} = require('../controllers/userController');
const {checkUserExistance2} = require('../controllers/userController');
const {deleteUser} = require('../controllers/userController');


router.post("/adduser", addUser);
router.post("/checkUserExistence", checkUserExistance);
router.post("/checkUserExistence2", checkUserExistance2);
router.put("/deleteuser/:deleteUserID", deleteUser);

module.exports = router;
    
      
