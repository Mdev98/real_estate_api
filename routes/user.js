const express  = require('express');
const router   = express.Router();
const User     = require('../models/user');

const { createUser, getUser, getSingleUser, updateUser, deleteUser } = require('../controllers/user');
const { protect, authorize } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');

router.use(protect)
router.use(authorize('admin'))

router
    .route(`${process.env.API}/users`)
    .post(createUser)
    .get(advancedResult(User, 'User'), getUser)

router
    .route(`${process.env.API}/users/:id`)
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser)


module.exports = router;

