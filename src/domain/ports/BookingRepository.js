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

  // NUEVO: Método para verificar si una habitación está disponible
  async isRoomAvailable(roomId, checkInDate, checkOutDate) {
    throw new Error('isRoomAvailable method not implemented');
  }

  // NUEVO: Método para encontrar reservas por usuario
  async findByUserId(userId) {
    throw new Error('findByUserId method not implemented');
  }
}