import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['individual_1', 'individual_2', 'individual_3', 'suite_2', 'suite_family']
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  beds: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  amenities: [String]
}, {
  timestamps: true
});

export const RoomModel = mongoose.model('Room', roomSchema);