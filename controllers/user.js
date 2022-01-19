const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/async');
const User          = require('../models/user');


// @desc    Create a user
// @route   POST  /api/v1/users/
// @access  PRIVATE

exports.createUser = asyncHandler(async (req, res) => {

    const user = await User.Create(req.body);

    res.status(201).json({ success : true, data : user })
})

// @desc    Get all user
// @route   GET  /api/v1/users
// @access  PRIVATE

exports.getUser = asyncHandler(async (req, res) => {
    console.log(res.data)

    const user = await User.aggregate([
        {
          $lookup:
            {
              from: "houses",
              localField: "_id",
              foreignField: "manager",
              as: "houses"
            }
        },

        {
            $match :  res.data.query
        }
      ])

    // .find(res.data.query).sort('-createdAt').skip(res.data.startIndex).limit(res.data.limit)

    res.status(200).json({ success : true, count : user.length, pagination : res.data.pagination, data : user})
})

// @desc    Get a single user
// @route   GET  /api/v1/users/:id
// @access  PRIVATE

exports.getSingleUser = asyncHandler(async (req, res) => {
    console.log(req.params.id)

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

    res.status(200).json({ success : true, data : user })
})

// @desc    Update a  user
// @route   PUT  /api/v1/users/:id
// @access  PRIVATE

exports.updateUser = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });

    res.status(200).json({ success : true, message : "User info updated", data : user })
})

// @desc    Delete a  user
// @route   DELETE  /api/v1/users/:id
// @access  PRIVATE

exports.deleteUser = asyncHandler(async (req, res) => {

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success : true, message : "User deleted"})
})