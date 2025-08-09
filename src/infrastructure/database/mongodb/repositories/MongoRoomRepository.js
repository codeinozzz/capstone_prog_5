import { RoomRepository } from '../../../../domain/ports/RoomRepository.js';
import { BaseMongoRepository } from './BaseMongoRepository.js';
import { RoomModel } from '../models/RoomModel.js';
import { Room } from '../../../../domain/entities/Room.js';

export class MongoRoomRepository extends BaseMongoRepository {
  constructor() {
    super(RoomModel, Room);
  }

  async findByHotel(hotelId) {
    const docs = await this.model.find({ hotelId });
    return docs.map(doc => this.toEntity(doc));
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
    
    // FILTRAR documentos con hotelId null ANTES de mapear
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