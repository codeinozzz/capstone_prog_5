// src/domain/ports/RoomRepository.js
import { BaseRepository } from './BaseRepository.js';

export class RoomRepository extends BaseRepository {
  async findByHotel(hotelId) {
    throw new Error('findByHotel method not implemented');
  }

  async searchRooms(filters) {
    throw new Error('searchRooms method not implemented');
  }

  // NUEVO: Método para encontrar habitaciones disponibles
  async findAvailableRooms(hotelId, checkInDate, checkOutDate) {
    throw new Error('findAvailableRooms method not implemented');
  }
}