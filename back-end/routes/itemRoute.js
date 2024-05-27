const express = require('express');
const router = express.Router();
const {deleteItem , addItem, updateItem, itemCheck} = require('../controllers/itemController');
const {upload} = require('../middleware/fileUploadMulter');



router.post("/additem", upload.single('image'), addItem);
router.delete('/deleteItem/:productId', deleteItem);
router.put("/edititem/:productId", updateItem);
router.post("/checkitem", itemCheck);


module.exports = router;

