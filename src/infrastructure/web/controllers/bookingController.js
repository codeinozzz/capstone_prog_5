import * as bookingUseCases from '../../../application/usecases/bookingUseCases.js';

export const createBookingController = (bookingRepository, hotelRepository) => ({
  
  async create(req, res) {
    const result = await bookingUseCases.createBooking(req.body, bookingRepository, hotelRepository);
    
    result
      .onSuccess(booking => {
        res.status(201).json({
          success: true,
          message: 'Booking created successfully',
          data: {
            bookingId: booking.id,
            confirmationNumber: booking.confirmationNumber,
            firstName: booking.firstName,
            lastName: booking.lastName,
            email: booking.email,
            hotel: booking.hotel
          }
        });
      })
      .onError(errorMsg => {
        res.status(400).json({
          success: false,
          message: errorMsg
        });
      });
  },

  async getAll(req, res) {
    const result = await bookingUseCases.getAllBookings(bookingRepository);
    
    result
      .onSuccess(bookings => {
        res.json({
          success: true,
          data: bookings,
          total: bookings.length
        });
      })
      .onError(errorMsg => {
        res.status(500).json({
          success: false,
          message: errorMsg
        });
      });
  },

  async getById(req, res) {
    const result = await bookingUseCases.getBookingById(req.params.id, bookingRepository);
    
    result
      .onSuccess(booking => {
        res.json({
          success: true,
          data: booking
        });
      })
      .onError(errorMsg => {
        res.status(404).json({
          success: false,
          message: errorMsg
        });
      });
  },

  async getByConfirmationNumber(req, res) {
    const result = await bookingUseCases.getBookingByConfirmationNumber(
      req.params.confirmationNumber, 
      bookingRepository
    );
    
    result
      .onSuccess(booking => {
        res.json({
          success: true,
          data: booking
        });
      })
      .onError(errorMsg => {
        res.status(404).json({
          success: false,
          message: errorMsg
        });
      });
  },

  async getByEmail(req, res) {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const result = await bookingUseCases.getBookingsByEmail(email, bookingRepository);
    
    result
      .onSuccess(bookings => {
        res.json({
          success: true,
          data: bookings,
          total: bookings.length
        });
      })
      .onError(errorMsg => {
        res.status(400).json({
          success: false,
          message: errorMsg
        });
      });
  },

  async getByHotel(req, res) {
    const result = await bookingUseCases.getBookingsByHotel(
      req.params.hotelId, 
      bookingRepository, 
      hotelRepository
    );
    
    result
      .onSuccess(bookings => {
        res.json({
          success: true,
          data: bookings,
          total: bookings.length,
          hotelId: req.params.hotelId
        });
      })
      .onError(errorMsg => {
        res.status(404).json({
          success: false,
          message: errorMsg
        });
      });
  },

  async cancel(req, res) {
    const result = await bookingUseCases.cancelBooking(req.params.id, bookingRepository);
    
    result
      .onSuccess(booking => {
        res.json({
          success: true,
          message: 'Booking cancelled successfully',
          data: booking
        });
      })
      .onError(errorMsg => {
        res.status(400).json({
          success: false,
          message: errorMsg
        });
      });
  }

});