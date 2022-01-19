const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    date : {
        type : String,
        required: [true, 'Please add a date']
    },

    house: {
        type: mongoose.Schema.ObjectId,
        ref: 'House',
        required: true
    },

    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    toJSON : { virtuals : true },
    toObject: { virtuals : true},
    timestamps : true
});

module.exports = mongoose.model('Visit', visitSchema);