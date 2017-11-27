var mongoose = require('mongoose');
var address = mongoose.model('address', {

    address: {
        type: String,
        minimumLength: 1,
        require: false,
        trim: true
    },
    lat: {
        type: Number,
        minimumLength: 1,
        require: false,
    },
    lng: {
        type: Number,
        minimumLength: 1,
        require: false,
    },
    temp: {
        type: Number,
        minimumLength: 1,
        require: false,
    },IPAddress: {
        type: String,
        minimumLength: 1,
        require: false,
        trim: true
    }

});

module.exports = {
    address
}