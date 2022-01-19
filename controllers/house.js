const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/async');
const House         = require('../models/house');
const path          = require('path')
// @desc    Create new house
// @route   POST  /api/v1/house
// @access  PRIVATE
exports.createHouse = asyncHandler(async (req, res, next) => { 
    const house = await House.create(req.body);
    res.status(201).json({
        success : true,
        data    : house
    })
});

// @desc    Fetch all houses
// @route   GET  /api/v1/house
// @access  PUBLIC
exports.getHouse = asyncHandler(async (req, res, next) => { 
    res.data.query.available = true;

    const house = await House.find(res.data.query).sort('-createdAt').skip(res.data.startIndex).limit(res.data.limit).populate('manager');
    res.status(200).json({ success : true, count : house.length, pagination : res.data.pagination, data : house});
    
});

// @desc    Fetch a single house
// @route   GET  /api/v1/house/:id
// @access  PUBLIC
exports.getSingleHouse = asyncHandler(async (req, res, next) => { 

    const house = await House.findById(req.params.id)

    if(!house){
        return next(new ErrorResponse("No record found", 404));
    }
    res.status(200).json({ success : true, data : house });
    
});

// @desc    Update a house
// @route   PUT  /api/v1/house/:id
// @access  PRIVATE
exports.updateHouse = asyncHandler(async (req, res, next) => { 

    let house = await House.findById(req.params.id)

    if(!house){
        return next(new ErrorResponse("No record found", 404));
    }

    if(req.user.role !== 'admin'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    house = await House.findOneAndUpdate(req.params.id, req.body, { new : true, runValidators : true})

    res.status(200).json({ success : true, message : "House detail updated", data : house });
    
});

// @desc    Delete a house
// @route   DELETE  /api/v1/house/:id
// @access  PRIVATE
exports.deleteHouse = asyncHandler(async (req, res, next) => { 

    const house = await House.findById(req.params.id)

    if(!house){
        return next(new ErrorResponse("No record found", 404));
    }

    if(req.user.role !== 'admin'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    house.remove();

    res.status(200).json({ success : true, data : house });
    
});

// @desc    Update gallery for house
// @route   PUT  /api/v1/house/:id/gallery
// @access  Private
exports.houseGalleryUpload = asyncHandler(async (req, res, next) => {
  
    let house = await House.findById(req.params.id);
    const files = req.files.file
    const galleryImage = []

    if(req.user.role !== 'admin'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    files.forEach(file => {
        if(!file.mimetype.startsWith('image')){
            return next(new ErrorResponse(`Please upload only image`, 400));
        }

        if(file.size > process.env.MAX_FILE_UPLOAD){
            return next(new ErrorResponse(`Please upload image less than 1MB`, 400));
        }

        const filename = file.name.split('.')[0];

        file.name = `${filename}_${house._id}${path.parse(file.name).ext}`;

        galleryImage.push(file.name);

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if(err){
                console.error(err);
                return next(new ErrorResponse(`SERVEUR ERROR : ${err.message}`, 500));
            }

            await House.findByIdAndUpdate(req.params.id, { gallery : galleryImage }, { new : true, runValidators : true})
        })
    })

    
    res.status(200).json({
        success: true,
        message : "house gallery uploaded",
        data : galleryImage
    })
});


