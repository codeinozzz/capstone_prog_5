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

export const validateBookingData = (req, res, next) => {
  if (req.method !== 'POST') {
    return next();
  }

  const { firstName, lastName, phone, email, hotelId } = req.body;

  if (!firstName || firstName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters'
    });
  }

  if (!lastName || lastName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Last name must be at least 2 characters'
    });
  }

  if (!phone || !isValidPhone(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Phone number must be valid'
    });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email must be valid'
    });
  }

  if (!hotelId || !isValidObjectId(hotelId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid hotel ID is required'
    });
  }

  if (req.body.roomId && !isValidObjectId(req.body.roomId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid room ID'
    });
  }

  req.body.firstName = firstName.trim();
  req.body.lastName = lastName.trim();
  req.body.phone = phone.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};