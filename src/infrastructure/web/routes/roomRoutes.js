import express from 'express';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management endpoints
 */

export const createRoomRoutes = (roomController) => {
  const router = express.Router();

  console.log('Setting up room routes...');

  /**
   * @swagger
   * /api/rooms:
   *   get:
   *     summary: Get all rooms
   *     tags: [Rooms]
   *     responses:
   *       200:
   *         description: List of rooms retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Room'
   */
  router.get('/', optionalAuth, roomController.getAll);

  /**
   * @swagger
   * /api/rooms/types:
   *   get:
   *     summary: Get available room types
   *     tags: [Rooms]
   *     responses:
   *       200:
   *         description: Room types retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/RoomType'
   */
  router.get('/types', roomController.getTypes);

  /**
   * @swagger
   * /api/rooms/search:
   *   get:
   *     summary: Search available rooms
   *     tags: [Rooms]
   *     parameters:
   *       - in: query
   *         name: numberOfPeople
   *         schema:
   *           type: integer
   *         description: Number of people
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [individual_1, individual_2, individual_3, suite_2, suite_family]
   *         description: Room type
   *       - in: query
   *         name: hotelId
   *         schema:
   *           type: string
   *         description: Filter by hotel ID
   *       - in: query
   *         name: location
   *         schema:
   *           type: string
   *         description: Filter by hotel location
   *       - in: query
   *         name: minPrice
   *         schema:
   *           type: number
   *         description: Minimum price filter
   *       - in: query
   *         name: maxPrice
   *         schema:
   *           type: number
   *         description: Maximum price filter
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [price, capacity]
   *         description: Sort criteria
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *         description: Sort order
   *     responses:
   *       200:
   *         description: Rooms found successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         allOf:
   *                           - $ref: '#/components/schemas/Room'
   *                           - type: object
   *                             properties:
   *                               hotel:
   *                                 type: object
   *                                 properties:
   *                                   id:
   *                                     type: string
   *                                   name:
   *                                     type: string
   *                                   location:
   *                                     type: string
   *                                   rating:
   *                                     type: number
   *                     filters:
   *                       type: object
   *       400:
   *         description: Invalid search parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/search', optionalAuth, roomController.searchAvailable);

  /**
   * @swagger
   * /api/rooms/hotel/{hotelId}:
   *   get:
   *     summary: Get rooms by hotel
   *     tags: [Rooms]
   *     parameters:
   *       - in: path
   *         name: hotelId
   *         required: true
   *         schema:
   *           type: string
   *         description: Hotel ID
   *     responses:
   *       200:
   *         description: Hotel rooms retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Room'
   *                     hotelId:
   *                       type: string
   *       404:
   *         description: Hotel not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/hotel/:hotelId', optionalAuth, roomController.getByHotel);

  /**
   * @swagger
   * /api/rooms/{id}:
   *   get:
   *     summary: Get room by ID
   *     tags: [Rooms]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Room ID
   *     responses:
   *       200:
   *         description: Room found successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Room'
   *       404:
   *         description: Room not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: ['hotelId', 'type', 'capacity', 'price']
   *             properties:
   *               hotelId:
   *                 type: string
   *                 description: Hotel ID
   *               type:
   *                 type: string
   *                 enum: [individual_1, individual_2, individual_3, suite_2, suite_family]
   *               capacity:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 4
   *               beds:
   *                 type: string
   *               price:
   *                 type: number
   *                 minimum: 0
   *               available:
   *                 type: boolean
   *               amenities:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       201:
   *         description: Room created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Room'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post('/', 
    authenticate,                    
    (req, res, next) => {          
      console.log(`Creating room by user: ${req.user.username}`);
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
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Room ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               hotelId:
   *                 type: string
   *               type:
   *                 type: string
   *                 enum: [individual_1, individual_2, individual_3, suite_2, suite_family]
   *               capacity:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 4
   *               beds:
   *                 type: string
   *               price:
   *                 type: number
   *                 minimum: 0
   *               available:
   *                 type: boolean
   *               amenities:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Room updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Room'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Room not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.put('/:id', 
    authenticate,                   
    (req, res, next) => {
      console.log(`Updating room ${req.params.id} by user: ${req.user.username}`);
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
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Room ID
   *     responses:
   *       200:
   *         description: Room deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Room'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Room not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
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