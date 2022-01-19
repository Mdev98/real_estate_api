const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/async');
const Visit      = require('../models/visit');
const House         = require('../models/house');
const path          = require('path')

// @desc    Add a visit
// @route   POST  /api/v1/visit/:houseId
// @access  PRIVATE

exports.addVisit = asyncHandler(async (req, res, next) => { 
    
    req.body.customer = req.user.id
    const house = House.findById(req.params.houseId)

    if(!house) {
        return next(new Error('No ressource found', 404))
    }

    if(req.user.role !== 'user' && req.user.role !== 'admin'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    const visit = await Visit.create({
        ...req.body,
        house: req.params.houseId
    })

    res.status(201).json({ success : true, message : 'Visite added', data : visit});
    
});

// @desc    Fetch all visit
// @route   GET  /api/v1/visit
// @access  PRIVATE

exports.getVisit = asyncHandler(async (req, res, next) => { 

    if(req.user.role !== 'admin' && req.user.role !== 'manager'){
        return next(new ErrorResponse('Not authorize', 401));
    }
    
    const visits = await Visit.find(res.data.query).sort('-createdAt').skip(res.data.startIndex).limit(res.data.limit)
                                                                                                                    .populate('customer')
                                                                                                                    .populate('house')


    res.status(200).json({ success : true, count : visits.length, pagination : res.data.pagination, data : visits});
    
});


// @desc    Fetch single visit
// @route   GET  /api/v1/visit/:id
// @access  PRIVATE

exports.getSingleVisit = asyncHandler(async (req, res, next) => {

    if(req.user.role !== 'admin' && req.user.role !== 'manager'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    const visit = await Visit.findById(req.params.id)

    if(!visit) {
        return next(new ErrorResponse('Ressource not found', 404));
    }

    res.status(200).json({success:true, data: visit})

})

// @desc    Update visit
// @route   PUT  /api/v1/visit/:id
// @access  PRIVATE

exports.updateVisit = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        date: req.body.date,
    };

    if(req.user.role !== 'admin' && req.user.role !== 'user'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    const visit = await Visit.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: "Visit detail updated",
        data: visit,
    });

})

// @desc    Delete visit
// @route   DELETE  /api/v1/visit/:id
// @access  PRIVATE

exports.deleteVisit = asyncHandler(async (req, res, next) => {

    const visit = await Visit.findById(req.params.id)

    if(req.user.role !== 'admin' && req.user.role !== 'user'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    if(!visit) {
        return next(new ErrorResponse('Ressource not found', 404))
    }

    visit.remove();

    res.status(200).json({
        success: true,
        message: 'visit deleted'
    })

})