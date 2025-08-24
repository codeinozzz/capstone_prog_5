// src/infrastructure/factories/DependencyFactory.js - ACTUALIZADO
import { MongoHotelRepository } from '../database/mongodb/repositories/MongoHotelRepository.js';
import { MongoRoomRepository } from '../database/mongodb/repositories/MongoRoomRepository.js';
import { MongoBookingRepository } from '../database/mongodb/repositories/MongoBookingRepository.js';
import { createHotelController } from '../web/controllers/hotelController.js';
import { createRoomController } from '../web/controllers/roomController.js';
import { createBookingController } from '../web/controllers/bookingController.js';
import { createHotelRoutes } from '../web/routes/hotelRoutes.js';
import { createRoomRoutes } from '../web/routes/roomRoutes.js';
import { createBookingRoutes } from '../web/routes/bookingRoutes.js';
import { createAuthRoutes } from '../web/routes/authRoutes.js';

export class DependencyFactory {
  constructor() {
    this.repositories = null;
    this.controllers = null;
    this.routes = null;
  }

  createRepositories() {
    if (!this.repositories) {
      this.repositories = {
        hotel: new MongoHotelRepository(),
        room: new MongoRoomRepository(),
        booking: new MongoBookingRepository()
      };
    }
    return this.repositories;
  }

  createControllers() {
    if (!this.controllers) {
      const repositories = this.createRepositories();
      
      this.controllers = {
        hotel: createHotelController(repositories.hotel),
        room: createRoomController(repositories.room, repositories.hotel),
        // ACTUALIZADO: Booking controller ahora recibe roomRepository también
        booking: createBookingController(repositories.booking, repositories.hotel, repositories.room)
      };
    }
    return this.controllers;
  }

  createRoutes() {
    if (!this.routes) {
      const controllers = this.createControllers();
      
      this.routes = {
        auth: createAuthRoutes(),
        hotels: createHotelRoutes(controllers.hotel),
        rooms: createRoomRoutes(controllers.room),
        bookings: createBookingRoutes(controllers.booking)
      };
    }
    return this.routes;
  }

  createAll() {
    return {
      repositories: this.createRepositories(),
      controllers: this.createControllers(),
      routes: this.createRoutes()
    };
  }
}