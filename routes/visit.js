const express  = require('express');
const router   = express.Router();
const Visit     = require('../models/visit');

const { addVisit, getVisit, getSingleVisit, updateVisit, deleteVisit } = require('../controllers/visit');
const { protect, authorize } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');

router.use(protect)

router
    .route(`${process.env.API}/visit/:houseId`)
    .post(authorize('user', 'admin'), addVisit)

router
    .route(`${process.env.API}/visit`)
    .get(advancedResult(Visit, 'Visit'), authorize('manager', 'admin'), getVisit)

router
    .route(`${process.env.API}/visit/:id`)
    .get(authorize('admin', 'manager'), getSingleVisit)
    .put(authorize('admin', 'user'), updateVisit)
    .delete(authorize('admin', 'user'), deleteVisit)


module.exports = router