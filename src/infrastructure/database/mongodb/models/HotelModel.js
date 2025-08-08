import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  amenities: [String]
}, {
  timestamps: true
});

export const HotelModel = mongoose.model('Hotel', hotelSchema);