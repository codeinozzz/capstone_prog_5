// src/application/usecases/roomUseCases.js
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
  if (!hotelId || !isValidObjectId(hotelId)) {
    return Either.error('Invalid hotel ID');
  }
  
  const hotel = await hotelRepository.findById(hotelId);
  if (!hotel) {
    return Either.error('Hotel not found');
  }
  
  const rooms = await roomRepository.findByHotel(hotelId);
  return Either.success(rooms);
};

// NUEVO: Obtener habitaciones disponibles por fechas
export const getAvailableRooms = async (hotelId, checkIn, checkOut, roomRepository, hotelRepository) => {
  // Validaciones básicas
  if (!hotelId || !isValidObjectId(hotelId)) {
    return Either.error('Valid hotel ID is required');
  }

  if (!checkIn || !checkOut) {
    return Either.error('Check-in and check-out dates are required');
  }

  // Validar fechas
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return Either.error('Invalid date format');
  }

  if (checkOutDate <= checkInDate) {
    return Either.error('Check-out date must be after check-in date');
  }

  // Verificar que el hotel existe
  const hotel = await hotelRepository.findById(hotelId);
  if (!hotel) {
    return Either.error('Hotel not found');
  }

  try {
    // Obtener habitaciones disponibles (lógica en repository)
    const availableRooms = await roomRepository.findAvailableRooms(hotelId, checkInDate, checkOutDate);
    return Either.success(availableRooms);
  } catch (error) {
    console.error('Error getting available rooms:', error);
    return Either.error('Error checking room availability');
  }
};

export const updateRoom = async (id, updateData, roomRepository) => {
  if (!id || !isValidObjectId(id)) {
    return Either.error('Valid room ID is required');
  }
  
  if (updateData.type && !VALID_ROOM_TYPES.includes(updateData.type)) {
    return Either.error(`Room type must be one of: ${VALID_ROOM_TYPES.join(', ')}`);
  }
  
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