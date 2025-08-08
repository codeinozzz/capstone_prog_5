import { HotelRepository } from '../../../../domain/ports/HotelRepository.js';
import { BaseMongoRepository } from './BaseMongoRepository.js';
import { HotelModel } from '../models/HotelModel.js';
import { Hotel } from '../../../../domain/entities/Hotel.js';

export class MongoHotelRepository extends BaseMongoRepository {
  constructor() {
    super(HotelModel, Hotel);
  }

  async findByLocation(location) {
    const docs = await this.model.find({
      location: { $regex: location, $options: 'i' }
    });
    return docs.map(doc => this.toEntity(doc));
  }

  async searchHotels(filters) {
    const query = {};

    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }

    if (filters.amenity) {
      query.amenities = filters.amenity;
    }

    const docs = await this.model.find(query);
    
    let hotels = docs.map(doc => this.toEntity(doc));
    
    if (filters.minRating) {
      hotels = hotels.filter(hotel => hotel.rating >= parseFloat(filters.minRating));
    }

    return hotels;
  }

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