import { BaseRepository } from './BaseRepository.js';

export class BookingRepository extends BaseRepository {
  async findByEmail(email) {
    throw new Error('findByEmail method not implemented');
  }

  async findByConfirmationNumber(confirmationNumber) {
    throw new Error('findByConfirmationNumber method not implemented');
  }

  async findByHotel(hotelId) {
    throw new Error('findByHotel method not implemented');
  }
}
