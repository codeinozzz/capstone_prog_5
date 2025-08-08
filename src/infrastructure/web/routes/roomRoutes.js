import express from 'express';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';

export const createRoomRoutes = (roomController) => {
  const router = express.Router();

  console.log('Setting up room routes...');


  router.get('/', optionalAuth, roomController.getAll);                   
  router.get('/types', roomController.getTypes);                          
  router.get('/search', optionalAuth, roomController.searchAvailable);    
  router.get('/hotel/:hotelId', optionalAuth, roomController.getByHotel); 
  router.get('/:id', optionalAuth, roomController.getById);               


  router.post('/', 
    authenticate,                    
    (req, res, next) => {          
      console.log(`Creating room by user: ${req.user.username}`);
      next();
    },
    roomController.create          
  );

  router.put('/:id', 
    authenticate,                   
    (req, res, next) => {
      console.log(`Updating room ${req.params.id} by user: ${req.user.username}`);
      next();
    },
    roomController.update         
  );

  router.delete('/:id', 
    authenticate,                  
    (req, res, next) => {
      console.log(`Deleting room ${req.params.id} by user: ${req.user.username}`);
      next();
    },
    roomController.delete        
  );

  return router;
};