import { Room } from '../../domain/entities/Room.js';
import { Either } from '../../shared/utils/Either.js';
import mongoose from 'mongoose';

const VALID_ROOM_TYPES = ['individual_1', 'individual_2', 'individual_3', 'suite_2', 'suite_family'];

const isValidObjectId = (id) => {
  return id && mongoose.Types.ObjectId.isValid(id);
};

export const createRoom = async (roomData, roomRepository, hotelRepository) => {
  if (!roomData.hotelId || !isValidObjectId(roomData.hotelId)) {
    return Either.error('Valid hotel ID is required');
  }
  
  if (!roomData.type || !VALID_ROOM_TYPES.includes(roomData.type)) {
    return Either.error(`Room type must be one of: ${VALID_ROOM_TYPES.join(', ')}`);
  }
  
  if (!roomData.capacity || roomData.capacity < 1 || roomData.capacity > 4) {
    return Either.error('Capacity must be between 1 and 4');
  }
  
  const hotel = await hotelRepository.findById(roomData.hotelId);
  if (!hotel) {
    return Either.error('Hotel not found');
  }
  
  const room = new Room(roomData);
  const savedRoom = await roomRepository.create(room);
  
  return Either.success(savedRoom);
};

export const getRoomById = async (id, roomRepository) => {
  // Validate ID - cambiado para ObjectId
  if (!id || !isValidObjectId(id)) {
    return Either.error('Valid room ID is required');
  }
  
  const room = await roomRepository.findById(id);
  
  if (!room) {
    return Either.error('Room not found');
  }
  
  return Either.success(room);
};

export const getAllRooms = async (roomRepository) => {
  const rooms = await roomRepository.findAll();
  return Either.success(rooms);
};

export const getRoomsByHotel = async (hotelId, roomRepository, hotelRepository) => {
  // Validate hotel ID - cambiado para ObjectId
  if (!hotelId || !isValidObjectId(hotelId)) {
    return Either.error('Invalid hotel ID');
  }
  
  // Check if hotel exists
  const hotel = await hotelRepository.findById(hotelId);
  if (!hotel) {
    return Either.error('Hotel not found');
  }
  
  const rooms = await roomRepository.findByHotel(hotelId);
  return Either.success(rooms);
};

export const updateRoom = async (id, updateData, roomRepository) => {
  // Validate ID - cambiado para ObjectId
  if (!id || !isValidObjectId(id)) {
    return Either.error('Valid room ID is required');
  }
  
  // Validate type if provided
  if (updateData.type && !VALID_ROOM_TYPES.includes(updateData.type)) {
    return Either.error(`Room type must be one of: ${VALID_ROOM_TYPES.join(', ')}`);
  }
  
  // Validate capacity if provided
  if (updateData.capacity && (updateData.capacity < 1 || updateData.capacity > 4)) {
    return Either.error('Capacity must be between 1 and 4');
  }
  
  const updatedRoom = await roomRepository.update(id, updateData);
  
  if (!updatedRoom) {
    return Either.error('Room not found');
  }
  
  return Either.success(updatedRoom);
};

export const deleteRoom = async (id, roomRepository) => {
  // Validate ID - cambiado para ObjectId
  if (!id || !isValidObjectId(id)) {
    return Either.error('Valid room ID is required');
  }
  
  const deletedRoom = await roomRepository.delete(id);
  
  if (!deletedRoom) {
    return Either.error('Room not found');
  }
  
  return Either.success(deletedRoom);
};

export const searchRooms = async (filters, roomRepository) => {
  // Basic validation
  if (filters.numberOfPeople && (isNaN(filters.numberOfPeople) || filters.numberOfPeople <= 0)) {
    return Either.error('Number of people must be greater than 0');
  }
  
  if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
    return Either.error('Minimum price cannot be greater than maximum price');
  }
  
  const rooms = await roomRepository.searchRooms(filters);
  return Either.success(rooms);
};

export const getRoomTypes = async () => {
  const types = [
    { value: 'individual_1', label: 'Individual 1 person (1 bed)', capacity: 1 },
    { value: 'individual_2', label: 'Individual 2 persons (2 beds)', capacity: 2 },
    { value: 'individual_3', label: 'Individual 3 persons (3 beds)', capacity: 3 },
    { value: 'suite_2', label: 'Suite for 2 persons (1 large bed)', capacity: 2 },
    { value: 'suite_family', label: 'Family suite (1 large bed + 1 small bed)', capacity: 4 }
  ];
  
  return Either.success(types);
};