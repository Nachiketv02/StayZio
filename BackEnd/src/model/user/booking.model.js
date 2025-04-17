const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    reviewed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'propertyListing',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

const bookingModel = mongoose.model('booking', bookingSchema);

module.exports = bookingModel;
