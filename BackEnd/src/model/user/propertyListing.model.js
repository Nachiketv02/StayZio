const mongoose = require('mongoose');

const propertyListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please select a property type'],
    enum: {
      values: ['Apartment', 'House', 'Villa', 'Condo', 'Townhouse', 'Studio', 'Other'],
      message: 'Please select a valid property type'
    }
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  country: {
    type: String,
    required: [true, 'Please provide a country']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [1, 'Price must be at least 1']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please provide number of bedrooms'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please provide number of bathrooms'],
    min: [0, 'Bathrooms cannot be negative']
  },
  amenities: {
    type: [String],
    enum: [
      'WiFi',
      'Air Conditioning',
      'Parking',
      'Swimming Pool',
      'Gym',
      'Kitchen',
      'Beach Access',
      'TV',
      'Ocean View',
      'Pet Friendly'
    ]
  },
  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      }
    }
  ],
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
});

const propertyListingModel = mongoose.model('propertyListing', propertyListingSchema);

module.exports = propertyListingModel;
