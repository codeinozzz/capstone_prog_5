// src/infrastructure/web/routes/bookingRoutes.js
import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/clerkMiddleware.js';
import { validateBookingData } from '../middleware/bookingValidator.js';

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management endpoints
 */

export const createBookingRoutes = (bookingController) => {
  const router = express.Router();

  console.log('Setting up booking routes...');

  /**
   * @swagger
   * /api/bookings:
   *   post:
   *     summary: Create new booking
   *     tags: [Bookings]
   *     description: Create a new hotel room booking
   */
  router.post('/', 
    validateBookingData, // Validar datos primero
    optionalAuth, // Permitir reservas sin autenticación pero loguear si hay usuario
    (req, res, next) => {
      if (req.user) {
        console.log(`Creating booking by authenticated user: ${req.user.email}`);
      } else {
        console.log('Creating booking by guest user');
      }
      next();
    },
    bookingController.create
  );

  /**
   * @swagger
   * /api/bookings:
   *   get:
   *     summary: Get all bookings
   *     tags: [Bookings]
   *     security:
   *       - bearerAuth: []
   *     description: Requires authentication
   */
  router.get('/', 
    requireAuth,
    (req, res, next) => {
      console.log(`Getting all bookings by user: ${req.user.email}`);
      next();
    },
    bookingController.getAll
  );

  /**
   * @swagger
   * /api/bookings/search:
   *   get:
   *     summary: Search bookings by email
   *     tags: [Bookings]
   */
  router.get('/search', 
    optionalAuth,
    bookingController.getByEmail
  );

  /**
   * @swagger
   * /api/bookings/confirmation/{confirmationNumber}:
   *   get:
   *     summary: Get booking by confirmation number
   *     tags: [Bookings]
   */
  router.get('/confirmation/:confirmationNumber', 
    optionalAuth,
    bookingController.getByConfirmationNumber
  );

  /**
   * @swagger
   * /api/bookings/hotel/{hotelId}:
   *   get:
   *     summary: Get bookings by hotel
   *     tags: [Bookings]
   *     security:
   *       - bearerAuth: []
   */
  router.get('/hotel/:hotelId', 
    requireAuth,
    (req, res, next) => {
      console.log(`Getting bookings for hotel ${req.params.hotelId} by user: ${req.user.email}`);
      next();
    },
    bookingController.getByHotel
  );

  /**
   * @swagger
   * /api/bookings/{id}:
   *   get:
   *     summary: Get booking by ID
   *     tags: [Bookings]
   */
  router.get('/:id', 
    optionalAuth,
    bookingController.getById
  );

  /**
   * @swagger
   * /api/bookings/{id}/cancel:
   *   put:
   *     summary: Cancel booking
   *     tags: [Bookings]
   *     security:
   *       - bearerAuth: []
   */
  router.put('/:id/cancel', 
    requireAuth,
    (req, res, next) => {
      console.log(`Cancelling booking ${req.params.id} by user: ${req.user.email}`);
      next();
    },
    bookingController.cancel
  );

  return router;
};