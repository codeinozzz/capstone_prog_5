import express from 'express';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';

export const createHotelRoutes = (hotelController) => {
  const router = express.Router();

  console.log('Setting up hotel routes...');

  router.get('/', optionalAuth, hotelController.getAll);
  router.get('/search', optionalAuth, hotelController.search);
  router.get('/:id', optionalAuth, hotelController.getById);

  router.post('/', 
    authenticate,
    (req, res, next) => {
      console.log(`Creating hotel by user: ${req.user.username}`);
      next();
    },
    hotelController.create
  );

  router.put('/:id', 
    authenticate,
    (req, res, next) => {
      console.log(`Updating hotel ${req.params.id} by user: ${req.user.username}`);
      next();
    },
    hotelController.update
  );

  router.delete('/:id', 
    authenticate,
    (req, res, next) => {
      console.log(`Deleting hotel ${req.params.id} by user: ${req.user.username}`);
      next();
    },
    hotelController.delete
  );

  return router;
};