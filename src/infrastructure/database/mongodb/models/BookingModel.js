import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: false
  },
  // NUEVOS CAMPOS SIMPLES
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  // CAMPOS EXISTENTES
  confirmationNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// ÍNDICES BÁSICOS SOLAMENTE
bookingSchema.index({ email: 1 });
bookingSchema.index({ confirmationNumber: 1 });

export const BookingModel = mongoose.model('Booking', bookingSchema);