import { HotelRepository } from '../../../../domain/ports/HotelRepository.js';
import { HotelModel } from '../models/HotelModel.js';
import { Hotel } from '../../../../domain/entities/Hotel.js';

export class MongoHotelRepository extends HotelRepository {
  
  async create(hotel) {
    const doc = new HotelModel(hotel);
    const saved = await doc.save();
    return this.toEntity(saved);
  }

  async findById(id) {
    const doc = await HotelModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll() {
    const docs = await HotelModel.find();
    return docs.map(doc => this.toEntity(doc));
  }

  async update(id, updateData) {
    const doc = await HotelModel.findByIdAndUpdate(id, updateData, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id) {
    const doc = await HotelModel.findByIdAndDelete(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByLocation(location) {
    const docs = await HotelModel.find({
      location: { $regex: location, $options: 'i' }
    });
    return docs.map(doc => this.toEntity(doc));
  }

  async searchHotels(filters) {
    const query = {};

    // Build query object
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }

    if (filters.amenity) {
      query.amenities = filters.amenity;
    }

    const docs = await HotelModel.find(query);
    
    // Use map to convert and filter if needed
    let hotels = docs.map(doc => this.toEntity(doc));
    
    // Additional filtering with JavaScript filter
    if (filters.minRating) {
      hotels = hotels.filter(hotel => hotel.rating >= parseFloat(filters.minRating));
    }

    return hotels;
  }

  // Simple converter
  toEntity(doc) {
    return new Hotel({
      id: doc._id.toString(),
      name: doc.name,
      location: doc.location,
      description: doc.description,
      rating: doc.rating,
      amenities: doc.amenities,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }
}