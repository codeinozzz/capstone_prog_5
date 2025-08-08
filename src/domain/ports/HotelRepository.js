import { BaseRepository } from './BaseRepository.js';

export class HotelRepository extends BaseRepository {
  async findByLocation(location) {
    throw new Error('findByLocation method not implemented');
  }

  async searchHotels(filters) {
    throw new Error('searchHotels method not implemented');
  }
}
