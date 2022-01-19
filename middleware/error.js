const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    // console.log(err);

    let error = { ...err };

    error.message = err.message;
    // Bad id 
    if(err.name === 'CastError'){
        const message = 'Ressources does not exist';
        error = new ErrorResponse(message, 404);
    }
    // Mongoose duplicate key
    if(err.code === 11000) {
        const message = 'Info entered already exist';
        error = new ErrorResponse(message, 400);
    }

    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success : false,
        error   : error.message || 'Server Error'
    })
}

module.exports = errorHandler;