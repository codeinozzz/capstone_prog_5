import { RoomRepository } from '../../../../domain/ports/RoomRepository.js';
import { RoomModel } from '../models/RoomModel.js';
import { Room } from '../../../../domain/entities/Room.js';

export class MongoRoomRepository extends RoomRepository {
  
  async create(room) {
    const doc = new RoomModel(room);
    const saved = await doc.save();
    return this.toEntity(saved);
  }

  async findById(id) {
    const doc = await RoomModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll() {
    const docs = await RoomModel.find();
    return docs.map(doc => this.toEntity(doc));
  }

  async update(id, updateData) {
    const doc = await RoomModel.findByIdAndUpdate(id, updateData, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id) {
    const doc = await RoomModel.findByIdAndDelete(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByHotel(hotelId) {
    const docs = await RoomModel.find({ hotelId });
    return docs.map(doc => this.toEntity(doc));
  }

  async searchRooms(filters) {
    const query = { available: true };

    // Build query
    if (filters.numberOfPeople) {
      query.capacity = { $gte: parseInt(filters.numberOfPeople) };
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.hotelId) {
      query.hotelId = filters.hotelId;
    }

    // Price range
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
    }

    let docs = await RoomModel.find(query).populate('hotelId');
    
    // Convert to entities first
    let rooms = docs.map(doc => {
      const room = this.toEntity(doc);
      // Add hotel info if populated
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

    // Filter by hotel location using JavaScript filter
    if (filters.location) {
      rooms = rooms.filter(room => 
        room.hotel && room.hotel.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort rooms using basic sorting
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
      hotelId: doc.hotelId.toString(),
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
