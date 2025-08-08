import { MongoHotelRepository } from '../database/mongodb/repositories/MongoHotelRepository.js';
import { MongoRoomRepository } from '../database/mongodb/repositories/MongoRoomRepository.js';
import { createHotelController } from '../web/controllers/hotelController.js';
import { createRoomController } from '../web/controllers/roomController.js';
import { createHotelRoutes } from '../web/routes/hotelRoutes.js';
import { createRoomRoutes } from '../web/routes/roomRoutes.js';
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
        room: new MongoRoomRepository()
      };
    }
    return this.repositories;
  }

  createControllers() {
    if (!this.controllers) {
      const repositories = this.createRepositories();
      
      this.controllers = {
        hotel: createHotelController(repositories.hotel),
        room: createRoomController(repositories.room, repositories.hotel)
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
        rooms: createRoomRoutes(controllers.room)
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