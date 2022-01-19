const mongoose = require('mongoose');
const geoLoc   = require('../utils/geoloc');
const opencage = require('opencage-api-client');

const houseSchema = new mongoose.Schema({
    saleOrRent : {
        type : String,
        enum : ['sale', 'rent'],
        required: [true, 'Please specify ! ']
    },
    description: {
        type : String 
    },
    address : {
        type: String,
        required : [true, 'Please specify an address']
    },
    location: {
        // GeoJSON Point
        type: {
        type: String,
        enum: ['Point']
        },
        coordinates: {
        type: [Number],
        index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        country: String,
        suburb : String
    },
    gallery : {
        type : Array
    },
    houseType : {
        type : String,
        required: [true, 'Please specify the type of house']
    },
    housePrice : {
        type : Number,
        required :[true, 'Please specify a price'],
    },
    bedRoom : {
        type : Number,
        required : [true, 'Please specify the number of room']
    },
    parlour : {
        type : Number,
        required : [true, 'Please specify the number of parlour']
    },
    bathroom : {
        type : Number,
        required : [true, 'Please specify the number of bathroom']
    },
    pool : {
        type : Boolean,
        default : false
    },
    manager : {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    available : {
        type: Boolean,
        default : true
    }
}, {
    toJSON : { virtuals : true },
    toObject: { virtuals : true},
    timestamps : true
})

houseSchema.pre('save', async function(next) {

    const location = await geoLoc(this.address);
    const coord = `${location.coord[1]}, ${location.coord[0]}`;


    const res = await opencage.geocode({ q : coord, language : 'fr' });
    const data = res.results[0].components;
    
    this.location = {
        type : 'Point',
        "coordinates" : [location.coord[1], location.coord[0]],
        "country" : data.country,
        "state" : data.state,
        "city" : data.city_district,
        "suburb" : data.suburb,
        "street" : data.neighbourhood
    }

    this.address = this.address.split(',')[2];
    
    next();
})

module.exports = mongoose.model('House', houseSchema);