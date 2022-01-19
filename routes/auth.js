const express  = require('express');
const router   = express.Router();

const { register, login, logout, showProfile, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');


router.route(`${process.env.API}/auth/register`).post(register);

router.route(`${process.env.API}/auth/login`).post(login);

router.route(`${process.env.API}/auth/logout`).get(logout);

router.route(`${process.env.API}/auth/forgotpassword`).post(forgotPassword);

router.route(`${process.env.API}/auth/resetpassword/:resettoken`).put(resetPassword);

router.route(`${process.env.API}/auth/me`).get(protect, showProfile);

router.route(`${process.env.API}/auth/updatedetails`).put(protect, updateDetails);

router.route(`${process.env.API}/auth/updatepassword`).put(protect, updatePassword);

module.exports = router;
