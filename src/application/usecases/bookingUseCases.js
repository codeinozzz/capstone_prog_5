// src/application/usecases/bookingUseCases.js - ACTUALIZADO PARA HABITACIONES
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

export const createBooking = async (bookingData, bookingRepository, hotelRepository, roomRepository) => {
  // VALIDACIONES BÁSICAS
  if (!bookingData.firstName || bookingData.firstName.length < 2) {
    return Either.error('Name must be at least 2 characters');
  }

  if (!bookingData.lastName || bookingData.lastName.length < 2) {
    return Either.error('Last name must be at least 2 characters');
  }

  if (!bookingData.email || !isValidEmail(bookingData.email)) {
    return Either.error('Email must be valid');
  }

  // CAMBIADO: Ahora requiere roomId obligatorio
  if (!bookingData.roomId || !isValidObjectId(bookingData.roomId)) {
    return Either.error('Valid room ID is required');
  }

  // VALIDACIONES DE FECHAS
  if (!bookingData.checkInDate) {
    return Either.error('Check-in date is required');
  }

  if (!bookingData.checkOutDate) {
    return Either.error('Check-out date is required');
  }

  const checkInDate = new Date(bookingData.checkInDate);
  const checkOutDate = new Date(bookingData.checkOutDate);

  if (checkOutDate <= checkInDate) {
    return Either.error('Check-out date must be after check-in date');
  }

  try {
    // NUEVO: Obtener habitación para extraer hotelId
    const room = await roomRepository.findById(bookingData.roomId);
    if (!room) {
      return Either.error('Room not found');
    }

    // NUEVO: Verificar que el hotel de la habitación existe
    const hotel = await hotelRepository.findById(room.hotelId);
    if (!hotel) {
      return Either.error('Hotel not found');
    }

    // NUEVO: Verificar disponibilidad de la habitación para esas fechas
    const isRoomAvailable = await bookingRepository.isRoomAvailable(
      bookingData.roomId, 
      checkInDate, 
      checkOutDate
    );

    if (!isRoomAvailable) {
      return Either.error('Room is not available for the selected dates');
    }

    // Crear reserva con hotelId extraído de la habitación
    const booking = new Booking({
      firstName: bookingData.firstName.trim(),
      lastName: bookingData.lastName.trim(),
      phone: bookingData.phone.trim(),
      email: bookingData.email.trim().toLowerCase(),
      hotelId: room.hotelId, // EXTRAÍDO de la habitación
      roomId: bookingData.roomId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      userId: bookingData.userId || null,
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

export const getBookingsByUserId = async (userId, bookingRepository) => {
  if (!userId) {
    return Either.error('User ID is required');
  }

  const bookings = await bookingRepository.findByUserId(userId);
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

  // NUEVO: Validar política de cancelación (3 días antes)
  const now = new Date();
  const checkInDate = new Date(booking.checkInDate);
  const daysDiff = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24));

  if (daysDiff < 3) {
    return Either.error('Bookings can only be cancelled 3 or more days before check-in date');
  }

  const updatedBooking = await bookingRepository.update(id, { 
    status: 'cancelled',
    updatedAt: new Date()
  });

  return Either.success(updatedBooking);
};