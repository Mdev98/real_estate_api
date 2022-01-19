const express  = require('express');
const router   = express.Router();

const advancedResult = require('../middleware/advancedResult');
const { protect, authorize } = require('../middleware/auth');
const House = require('../models/house')


const { createHouse, getHouse, getSingleHouse, updateHouse, deleteHouse, houseGalleryUpload } = require('../controllers/house');
// const { protect } = require('../middleware/auth');

router
    .route(`${process.env.API}/house`)
    .post(protect, authorize('admin'), createHouse)
    .get(advancedResult(House, 'House'), getHouse);

router
    .route(`${process.env.API}/house/:id`)
    .get(getSingleHouse)
    .put(protect, authorize('admin'), updateHouse)
    .delete(deleteHouse)

router
    .route(`${process.env.API}/house/:id/gallery`)
    .put(protect, authorize('admin'), houseGalleryUpload)
    
module.exports = router;