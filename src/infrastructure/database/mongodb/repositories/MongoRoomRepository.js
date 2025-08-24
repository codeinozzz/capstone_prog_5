import { RoomRepository } from '../../../../domain/ports/RoomRepository.js';
import { BaseMongoRepository } from './BaseMongoRepository.js';
import { RoomModel } from '../models/RoomModel.js';
import { BookingModel } from '../models/BookingModel.js';
import { Room } from '../../../../domain/entities/Room.js';

export class MongoRoomRepository extends BaseMongoRepository {
  constructor() {
    super(RoomModel, Room);
  }

  async findByHotel(hotelId) {
    const docs = await this.model.find({ hotelId });
    return docs.map(doc => this.toEntity(doc));
  }

  // NUEVO: Encontrar habitaciones disponibles por fechas
  async findAvailableRooms(hotelId, checkInDate, checkOutDate) {
    try {
      // 1. Encontrar todas las habitaciones del hotel
      const allRooms = await this.model.find({ 
        hotelId: hotelId,
        available: true  // Solo habitaciones marcadas como disponibles
      });

      // 2. Encontrar habitaciones que están ocupadas en el rango de fechas
      const occupiedBookings = await BookingModel.find({
        hotelId: hotelId,
        status: 'confirmed',
        // Lógica de solapamiento: una reserva interfiere si:
        // checkInDate < booking.checkOutDate AND checkOutDate > booking.checkInDate
        $or: [
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate }
          }
        ]
      }).select('roomId');

      // 3. Extraer IDs de habitaciones ocupadas
      const occupiedRoomIds = occupiedBookings
        .map(booking => booking.roomId?.toString())
        .filter(Boolean);

      console.log(`Hotel ${hotelId}: Found ${occupiedRoomIds.length} occupied rooms for ${checkInDate.toDateString()} - ${checkOutDate.toDateString()}`);

      // 4. Filtrar habitaciones disponibles
      const availableRooms = allRooms.filter(room => 
        !occupiedRoomIds.includes(room._id.toString())
      );

      console.log(`Hotel ${hotelId}: ${availableRooms.length} of ${allRooms.length} rooms available`);

      // 5. Convertir a entidades y agregar información del hotel
      let rooms = availableRooms.map(doc => this.toEntity(doc));

      // 6. Popular con info del hotel si es necesario
      if (rooms.length > 0) {
        const populatedRooms = await this.model.find({
          _id: { $in: availableRooms.map(r => r._id) }
        }).populate('hotelId');

        rooms = populatedRooms.map(doc => {
          const room = this.toEntity(doc);
          if (doc.hotelId && typeof doc.hotelId === 'object') {
            room.hotel = {
              id: doc.hotelId._id.toString(),
              name: doc.hotelId.name,
              location: doc.hotelId.location,
              rating: doc.hotelId.rating
            };
          }
          return room;
        });
      }

      return rooms;

    } catch (error) {
      console.error('Error finding available rooms:', error);
      throw new Error('Database error checking room availability');
    }
  }

  async searchRooms(filters) {
    const query = { available: true };

    if (filters.numberOfPeople) {
      query.capacity = { $gte: parseInt(filters.numberOfPeople) };
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.hotelId) {
      query.hotelId = filters.hotelId;
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
    }

    let docs = await this.model.find(query).populate('hotelId');
    
    docs = docs.filter(doc => doc.hotelId !== null);
    
    let rooms = docs.map(doc => {
      const room = this.toEntity(doc);
      if (doc.hotelId && typeof doc.hotelId === 'object') {
        room.hotel = {
          id: doc.hotelId._id.toString(),
          name: doc.hotelId.name,
          location: doc.hotelId.location,
          rating: doc.hotelId.rating
        };
      }
      return room;
    });

    if (filters.location) {
      rooms = rooms.filter(room => 
        room.hotel && room.hotel.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.sortBy === 'price') {
      rooms = rooms.sort((a, b) => {
        return filters.sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
      });
    }

    if (filters.sortBy === 'capacity') {
      rooms = rooms.sort((a, b) => {
        return filters.sortOrder === 'desc' ? b.capacity - a.capacity : a.capacity - b.capacity;
      });
    }

    return rooms;
  }

  toEntity(doc) {
    return new Room({
      id: doc._id.toString(),
      hotelId: doc.hotelId && typeof doc.hotelId === 'object' 
        ? doc.hotelId._id.toString() 
        : doc.hotelId ? doc.hotelId.toString() : null,
      type: doc.type,
      capacity: doc.capacity,
      beds: doc.beds,
      price: doc.price,
      available: doc.available,
      amenities: doc.amenities,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }
}