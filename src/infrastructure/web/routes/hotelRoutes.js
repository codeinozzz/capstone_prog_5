import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/clerkMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel management endpoints
 */

export const createHotelRoutes = (hotelController) => {
  const router = express.Router();

  console.log('Setting up hotel routes with Clerk auth...');

  /**
   * @swagger
   * /api/hotels:
   *   get:
   *     summary: Get all hotels
   *     tags: [Hotels]
   *     responses:
   *       200:
   *         description: List of hotels retrieved successfully
   */
  router.get('/', optionalAuth, hotelController.getAll);

  /**
   * @swagger
   * /api/hotels/search:
   *   get:
   *     summary: Search hotels
   *     tags: [Hotels]
   */
  router.get('/search', optionalAuth, hotelController.search);

  /**
   * @swagger
   * /api/hotels/{id}:
   *   get:
   *     summary: Get hotel by ID
   *     tags: [Hotels]
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
   *     description: Requires Clerk authentication
   */
  router.post('/', 
    requireAuth,
    (req, res, next) => {
      console.log(`Creating hotel by user: ${req.user.email}`);
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
   *     description: Requires Clerk authentication
   */
  router.put('/:id', 
    requireAuth,
    (req, res, next) => {
      console.log(`Updating hotel ${req.params.id} by user: ${req.user.email}`);
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
   *     description: Requires Clerk authentication
   */
  router.delete('/:id', 
    requireAuth,
    (req, res, next) => {
      console.log(`Deleting hotel ${req.params.id} by user: ${req.user.email}`);
      next();
    },
    hotelController.delete
  );

  return router;
};