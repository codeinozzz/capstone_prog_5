import express from 'express';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel management endpoints
 */

export const createHotelRoutes = (hotelController) => {
  const router = express.Router();

  console.log('Setting up hotel routes...');

  /**
   * @swagger
   * /api/hotels:
   *   get:
   *     summary: Get all hotels
   *     tags: [Hotels]
   *     responses:
   *       200:
   *         description: List of hotels retrieved successfully
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
   *                         $ref: '#/components/schemas/Hotel'
   */
  router.get('/', optionalAuth, hotelController.getAll);

  /**
   * @swagger
   * /api/hotels/search:
   *   get:
   *     summary: Search hotels
   *     tags: [Hotels]
   *     parameters:
   *       - in: query
   *         name: location
   *         schema:
   *           type: string
   *         description: Filter by location
   *       - in: query
   *         name: minRating
   *         schema:
   *           type: number
   *         description: Minimum rating filter
   *       - in: query
   *         name: amenity
   *         schema:
   *           type: string
   *         description: Filter by amenity
   *     responses:
   *       200:
   *         description: Hotels found successfully
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
   *                         $ref: '#/components/schemas/Hotel'
   *                     filters:
   *                       type: object
   */
  router.get('/search', optionalAuth, hotelController.search);

  /**
   * @swagger
   * /api/hotels/{id}:
   *   get:
   *     summary: Get hotel by ID
   *     tags: [Hotels]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Hotel ID
   *     responses:
   *       200:
   *         description: Hotel found successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Hotel'
   *       404:
   *         description: Hotel not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/:id', optionalAuth, hotelController.getById);

  /**
   * @swagger
   * /api/hotels:
   *   post:
   *     summary: Create new hotel
   *     tags: [Hotels]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: ['name', 'location', 'description']
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 3
   *               location:
   *                 type: string
   *                 minLength: 3
   *               description:
   *                 type: string
   *                 minLength: 10
   *               rating:
   *                 type: number
   *                 minimum: 1
   *                 maximum: 5
   *               amenities:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       201:
   *         description: Hotel created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Hotel'
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
      console.log(`Creating hotel by user: ${req.user.username}`);
      next();
    },
    hotelController.create
  );

  /**
   * @swagger
   * /api/hotels/{id}:
   *   put:
   *     summary: Update hotel
   *     tags: [Hotels]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Hotel ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 3
   *               location:
   *                 type: string
   *                 minLength: 3
   *               description:
   *                 type: string
   *                 minLength: 10
   *               rating:
   *                 type: number
   *                 minimum: 1
   *                 maximum: 5
   *               amenities:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Hotel updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Hotel'
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
   *         description: Hotel not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.put('/:id', 
    authenticate,
    (req, res, next) => {
      console.log(`Updating hotel ${req.params.id} by user: ${req.user.username}`);
      next();
    },
    hotelController.update
  );

  /**
   * @swagger
   * /api/hotels/{id}:
   *   delete:
   *     summary: Delete hotel
   *     tags: [Hotels]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Hotel ID
   *     responses:
   *       200:
   *         description: Hotel deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/SuccessResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Hotel'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Hotel not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
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