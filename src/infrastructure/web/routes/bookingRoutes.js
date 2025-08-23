import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/clerkMiddleware.js';

export const createBookingRoutes = (bookingController) => {
  const router = express.Router();

  // Crear reserva - permitir sin auth pero capturar usuario si existe
  router.post('/', 
    optionalAuth,
    bookingController.create
  );

  // Mis reservas - requiere auth
  router.get('/my', 
    requireAuth,
    bookingController.getMyBookings
  );

  // Todas las reservas - requiere auth (admin)
  router.get('/', 
    requireAuth,
    bookingController.getAll
  );

  // Buscar por email
  router.get('/search', 
    optionalAuth,
    bookingController.getByEmail
  );

  // Buscar por número de confirmación
  router.get('/confirmation/:confirmationNumber', 
    optionalAuth,
    bookingController.getByConfirmationNumber
  );

  // Reservas por hotel
  router.get('/hotel/:hotelId', 
    requireAuth,
    bookingController.getByHotel
  );

  // Reserva por ID
  router.get('/:id', 
    optionalAuth,
    bookingController.getById
  );

  // Cancelar reserva
  router.put('/:id/cancel', 
    requireAuth,
    bookingController.cancel
  );

  return router;
};