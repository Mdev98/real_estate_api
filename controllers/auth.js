const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/async');
const User          = require('../models/user');
const sendEmail     = require('../utils/sendEmail');
const crypto        = require('crypto')

// @desc    Register a new user
// @route   POST  /api/v1/auth/register
// @access  Public

exports.register = asyncHandler(async (req, res) => {

    const user = await User.create(req.body);

    const token = user.generateAuthToken();

    res.status(201).json({ success : true, message : "User created", token, user })
})

// @desc    Login a new user
// @route   POST  /api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res, next) => {
    

    const user = await User.findByCredentials(req.body.email, req.body.password);
    

    setTokenResponse(user, 200, res);
})

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Show profile
// @route   GET  /api/v1/auth/me
// @access  Private

exports.showProfile = asyncHandler(async (req, res, next) => {

  const resultat = await User.aggregate([
    {
      $lookup:
        {
          from: "houses",
          localField: "_id",
          foreignField: "manager",
          as: "houses"
        }
    }
  ])

  const user = resultat.filter(user => user._id.toString() === req.user._id.toString())

    res.status(200).json({
        success: true,
        data : user
    })
})

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
  
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      success: true,
      data: user,
    });
  });
  
  // @desc      Update password
  // @route     PUT /api/v1/auth/updatepassword
  // @access    Private
  exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
  
    // Check current password
    if (!(await user.match(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }
  
    user.password = req.body.newPassword;
    await user.save();
  
    setTokenResponse(user, 200, res);
  });

// @desc    Forgot password 
// @route   POST  /api/v1/auth/forgotpassword
// @access  Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email : req.body.email })

    if(!user){
        return next(new ErrorResponse("No user found", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave : false})

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
    
})

// @desc      Reset password
// @route     PUT /api/v1/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }
  
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
  
    setTokenResponse(user, 200, res);

  });

// Get token from model, create cookie and send response

const setTokenResponse = (user, statusCode, res) => {
    const token = user.generateAuthToken();

    const options = {
        expires : new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly : true
    }

    if(process.env.NODE_ENV == 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success : true, token})
}