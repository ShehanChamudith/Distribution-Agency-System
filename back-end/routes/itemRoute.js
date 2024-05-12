const express = require('express');
const router = express.Router();
const {deleteItem , addItem, updateItem} = require('../controllers/itemController');
const {upload} = require('../middleware/fileUploadMulter');


router.post("/additem", upload.single('image'), addItem);
router.delete('/deleteItem/:productId', deleteItem);
router.put("/edititem/:productId", updateItem);


module.exports = router;

