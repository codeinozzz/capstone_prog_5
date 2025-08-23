import { Booking } from '../../domain/entities/Booking.js';
import { Either } from '../../shared/utils/Either.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => {
  return id && mongoose.Types.ObjectId.isValid(id);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.length >= 8;
};

export const createBooking = async (bookingData, bookingRepository, hotelRepository) => {
  if (!bookingData.firstName || bookingData.firstName.length < 2) {
    return Either.error('Name must be at least 2 characters');
  }

  if (!bookingData.lastName || bookingData.lastName.length < 2) {
    return Either.error('Last name must be at least 2 characters');
  }

  if (!bookingData.phone || !isValidPhone(bookingData.phone)) {
    return Either.error('Phone number must be valid');
  }

  if (!bookingData.email || !isValidEmail(bookingData.email)) {
    return Either.error('Email must be valid');
  }

  if (!bookingData.hotelId || !isValidObjectId(bookingData.hotelId)) {
    return Either.error('Valid hotel ID is required');
  }

  const hotel = await hotelRepository.findById(bookingData.hotelId);
  if (!hotel) {
    return Either.error('Hotel not found');
  }

  if (bookingData.roomId && !isValidObjectId(bookingData.roomId)) {
    return Either.error('Invalid room ID');
  }

  try {
    const booking = new Booking({
      firstName: bookingData.firstName.trim(),
      lastName: bookingData.lastName.trim(),
      phone: bookingData.phone.trim(),
      email: bookingData.email.trim().toLowerCase(),
      hotelId: bookingData.hotelId,
      roomId: bookingData.roomId || null,
      status: 'confirmed'
    });

    const savedBooking = await bookingRepository.create(booking);
    return Either.success(savedBooking);

  } catch (error) {
    console.error('Error creating booking:', error);
    return Either.error('Error creating booking');
  }
};

export const getBookingById = async (id, bookingRepository) => {
  if (!id || !isValidObjectId(id)) {
    return Either.error('Valid booking ID is required');
  }

  const booking = await bookingRepository.findById(id);
  
  if (!booking) {
    return Either.error('Booking not found');
  }

  return Either.success(booking);
};

export const getBookingByConfirmationNumber = async (confirmationNumber, bookingRepository) => {
  if (!confirmationNumber || confirmationNumber.length < 5) {
    return Either.error('Valid confirmation number is required');
  }

  const booking = await bookingRepository.findByConfirmationNumber(confirmationNumber);
  
  if (!booking) {
    return Either.error('Booking not found');
  }

  return Either.success(booking);
};

export const getBookingsByEmail = async (email, bookingRepository) => {
  if (!email || !isValidEmail(email)) {
    return Either.error('Valid email is required');
  }

  const bookings = await bookingRepository.findByEmail(email.toLowerCase());
  return Either.success(bookings);
};

export const getBookingsByHotel = async (hotelId, bookingRepository, hotelRepository) => {
  if (!hotelId || !isValidObjectId(hotelId)) {
    return Either.error('Valid hotel ID is required');
  }

  const hotel = await hotelRepository.findById(hotelId);
  if (!hotel) {
    return Either.error('Hotel not found');
  }

  const bookings = await bookingRepository.findByHotel(hotelId);
  return Either.success(bookings);
};

export const getAllBookings = async (bookingRepository) => {
  const bookings = await bookingRepository.findAll();
  return Either.success(bookings);
};

export const cancelBooking = async (id, bookingRepository) => {
  if (!id || !isValidObjectId(id)) {
    return Either.error('Valid booking ID is required');
  }

  const booking = await bookingRepository.findById(id);
  
  if (!booking) {
    return Either.error('Booking not found');
  }

  if (booking.status === 'cancelled') {
    return Either.error('Booking is already cancelled');
  }

  const updatedBooking = await bookingRepository.update(id, { 
    status: 'cancelled',
    updatedAt: new Date()
  });

  return Either.success(updatedBooking);
};