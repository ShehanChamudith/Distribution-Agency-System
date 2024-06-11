const express = require('express');
const router = express.Router();
const {addUser} = require('../controllers/userController');
const {checkUserExistance} = require('../controllers/userController');


router.post("/adduser", addUser);
router.post("/checkUserExistence", checkUserExistance);

module.exports = router;
    
      
