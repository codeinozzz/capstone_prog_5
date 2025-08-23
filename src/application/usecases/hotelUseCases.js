import { Hotel } from '../../domain/entities/Hotel.js';
import { Either } from '../../shared/utils/Either.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => {
  return id && mongoose.Types.ObjectId.isValid(id);
};

export const createHotel = async (hotelData, hotelRepository) => {
  if (!hotelData.name || hotelData.name.length < 3) {
    return Either.error('Hotel name must be at least 3 characters');
  }
  
  if (!hotelData.location || hotelData.location.length < 3) {
    return Either.error('Hotel location must be at least 3 characters');
  }
  
  if (!hotelData.description || hotelData.description.length < 10) {
    return Either.error('Hotel description must be at least 10 characters');
  }
  
  // Create hotel
  const hotel = new Hotel(hotelData);
  const savedHotel = await hotelRepository.create(hotel);
  
  return Either.success(savedHotel);
};

export const getHotelById = async (id, hotelRepository) => {
  // Validate ID - CAMBIADO: ahora valida ObjectId
  if (!id || !isValidObjectId(id)) {
    return Either.error('Valid hotel ID is required');
  }
  
  const hotel = await hotelRepository.findById(id);
  
  if (!hotel) {
    return Either.error('Hotel not found');
  }
  
  return Either.success(hotel);
};

export const getAllHotels = async (hotelRepository) => {
  const hotels = await hotelRepository.findAll();
  return Either.success(hotels);
};

export const updateHotel = async (id, updateData, hotelRepository) => {
  // Validate ID - CAMBIADO: ahora valida ObjectId
  if (!id || !isValidObjectId(id)) {
    return Either.error('Valid hotel ID is required');
  }
  
  // Validate data if provided
  if (updateData.name && updateData.name.length < 3) {
    return Either.error('Hotel name must be at least 3 characters');
  }
  
  if (updateData.location && updateData.location.length < 3) {
    return Either.error('Hotel location must be at least 3 characters');
  }
  
  if (updateData.description && updateData.description.length < 10) {
    return Either.error('Hotel description must be at least 10 characters');
  }
  
  const updatedHotel = await hotelRepository.update(id, updateData);
  
  if (!updatedHotel) {
    return Either.error('Hotel not found');
  }
  
  return Either.success(updatedHotel);
};

export const deleteHotel = async (id, hotelRepository) => {
  if (!id || !isValidObjectId(id)) {
    return Either.error('Valid hotel ID is required');
  }
  
  const deletedHotel = await hotelRepository.delete(id);
  
  if (!deletedHotel) {
    return Either.error('Hotel not found');
  }
  
  return Either.success(deletedHotel);
};

export const searchHotels = async (filters, hotelRepository) => {
  const hotels = await hotelRepository.searchHotels(filters);
  return Either.success(hotels);
};