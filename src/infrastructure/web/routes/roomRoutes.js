import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/clerkMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management endpoints
 */

export const createRoomRoutes = (roomController) => {
  const router = express.Router();

  console.log('Setting up room routes with Clerk auth...');

  /**
   * @swagger
   * /api/rooms:
   *   get:
   *     summary: Get all rooms
   *     tags: [Rooms]
   */
  router.get('/', optionalAuth, roomController.getAll);

  /**
   * @swagger
   * /api/rooms/types:
   *   get:
   *     summary: Get available room types
   *     tags: [Rooms]
   */
  router.get('/types', roomController.getTypes);

  /**
   * @swagger
   * /api/rooms/search:
   *   get:
   *     summary: Search available rooms
   *     tags: [Rooms]
   */
  router.get('/search', optionalAuth, roomController.searchAvailable);

  /**
   * @swagger
   * /api/rooms/hotel/{hotelId}:
   *   get:
   *     summary: Get rooms by hotel
   *     tags: [Rooms]
   */
  router.get('/hotel/:hotelId', optionalAuth, roomController.getByHotel);

  /**
   * @swagger
   * /api/rooms/{id}:
   *   get:
   *     summary: Get room by ID
   *     tags: [Rooms]
   */
  router.get('/:id', optionalAuth, roomController.getById);

  /**
   * @swagger
   * /api/rooms:
   *   post:
   *     summary: Create new room
   *     tags: [Rooms]
   *     security:
   *       - bearerAuth: []
   *     description: Requires Clerk authentication
   */
  router.post('/', 
    requireAuth,                    
    (req, res, next) => {          
      console.log(`Creating room by user: ${req.user.email}`);
      next();
    },
    roomController.create          
  );

  /**
   * @swagger
   * /api/rooms/{id}:
   *   put:
   *     summary: Update room
   *     tags: [Rooms]
   *     security:
   *       - bearerAuth: []
   *     description: Requires Clerk authentication
   */
  router.put('/:id', 
    requireAuth,                   
    (req, res, next) => {
      console.log(`Updating room ${req.params.id} by user: ${req.user.email}`);
      next();
    },
    roomController.update         
  );

  /**
   * @swagger
   * /api/rooms/{id}:
   *   delete:
   *     summary: Delete room
   *     tags: [Rooms]
   *     security:
   *       - bearerAuth: []
   *     description: Requires Clerk authentication
   */
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