import { BaseRepository } from './BaseRepository.js';

export class RoomRepository extends BaseRepository {
  async findByHotel(hotelId) {
    throw new Error('findByHotel method not implemented');
  }

  async searchRooms(filters) {
    throw new Error('searchRooms method not implemented');
  }
}