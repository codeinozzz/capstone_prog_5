import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/clerkMiddleware.js';

export const createRoomRoutes = (roomController) => {
  const router = express.Router();

  console.log('Setting up room routes with Clerk auth...');

  // Públicos (no requieren auth)
  router.get('/types', roomController.getTypes);

  // NUEVO: Verificar disponibilidad (público para que funcione desde rooms page)
  router.get('/available', optionalAuth, roomController.getAvailableRooms);

  // Consulta (optional auth)
  router.get('/', optionalAuth, roomController.getAll);
  router.get('/search', optionalAuth, roomController.searchAvailable);
  router.get('/hotel/:hotelId', optionalAuth, roomController.getByHotel);
  router.get('/:id', optionalAuth, roomController.getById);

  // Operaciones que requieren autenticación (admin)
  router.post('/', 
    requireAuth,                    
    (req, res, next) => {          
      console.log(`Creating room by user: ${req.user.email}`);
      next();
    },
    roomController.create          
  );

  router.put('/:id', 
    requireAuth,                   
    (req, res, next) => {
      console.log(`Updating room ${req.params.id} by user: ${req.user.email}`);
      next();
    },
    roomController.update         
  );

  router.delete('/:id', 
    requireAuth,                  
    (req, res, next) => {
      console.log(`Deleting room ${req.params.id} by user: ${req.user.email}`);
      next();
    },
    roomController.delete        
  );

  return router;
};