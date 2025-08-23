
import mongoose from 'mongoose';

const isValidObjectId = (id) => {
  return id && mongoose.Types.ObjectId.isValid(id);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateBookingData = (req, res, next) => {
  if (req.method !== 'POST') {
    return next();
  }

  const { firstName, lastName, phone, email, hotelId, checkInDate, checkOutDate } = req.body;

  // VALIDACIONES BÁSICAS
  if (!firstName || firstName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'First name must be at least 2 characters'
    });
  }

  if (!lastName || lastName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Last name must be at least 2 characters'
    });
  }

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: 'Phone is required'
    });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }

  if (!hotelId || !isValidObjectId(hotelId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid hotel ID is required'
    });
  }

  // VALIDACIONES DE FECHAS BÁSICAS
  if (!checkInDate) {
    return res.status(400).json({
      success: false,
      message: 'Check-in date is required'
    });
  }

  if (!checkOutDate) {
    return res.status(400).json({
      success: false,
      message: 'Check-out date is required'
    });
  }

  // LIMPIAR DATOS
  req.body.firstName = firstName.trim();
  req.body.lastName = lastName.trim();
  req.body.phone = phone.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};