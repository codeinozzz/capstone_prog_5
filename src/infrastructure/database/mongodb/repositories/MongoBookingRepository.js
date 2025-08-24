// src/infrastructure/database/mongodb/repositories/MongoBookingRepository.js - ACTUALIZADO
import { BaseMongoRepository } from './BaseMongoRepository.js';
import { BookingModel } from '../models/BookingModel.js';
import { Booking } from '../../../../domain/entities/Booking.js';

export class MongoBookingRepository extends BaseMongoRepository {
  constructor() {
    super(BookingModel, Booking);
  }

  async findByEmail(email) {
    const docs = await this.model.find({ email }).populate('hotelId').sort({ createdAt: -1 });
    return docs.map(doc => this.toEntity(doc));
  }

  async findByConfirmationNumber(confirmationNumber) {
    const doc = await this.model.findOne({ confirmationNumber }).populate('hotelId');
    return doc ? this.toEntity(doc) : null;
  }

  async findByHotel(hotelId) {
    const docs = await this.model.find({ hotelId }).populate('hotelId').sort({ createdAt: -1 });
    return docs.map(doc => this.toEntity(doc));
  }

  async findByUserId(userId) {
    const docs = await this.model.find({ userId }).populate('hotelId').sort({ createdAt: -1 });
    return docs.map(doc => this.toEntity(doc));
  }

  // NUEVO: Verificar si una habitación está disponible para fechas específicas
  async isRoomAvailable(roomId, checkInDate, checkOutDate) {
    try {
      const conflictingBooking = await this.model.findOne({
        roomId: roomId,
        status: 'confirmed',
        // Lógica de solapamiento: hay conflicto si:
        // checkInDate < existente.checkOutDate AND checkOutDate > existente.checkInDate
        $or: [
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate }
          }
        ]
      });

      // Si no hay reservas conflictivas, la habitación está disponible
      const isAvailable = !conflictingBooking;
      
      console.log(`Room ${roomId} availability check:`, {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        available: isAvailable,
        conflictingBooking: conflictingBooking ? conflictingBooking.confirmationNumber : null
      });

      return isAvailable;

    } catch (error) {
      console.error('Error checking room availability:', error);
      throw new Error('Database error checking room availability');
    }
  }

  async generateConfirmationNumber() {
    let confirmationNumber;
    let exists = true;

    while (exists) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
      
      confirmationNumber = `HOTEL-${year}${month}${day}-${random}`;
      
      const existing = await this.model.findOne({ confirmationNumber });
      exists = !!existing;
    }

    return confirmationNumber;
  }

  async create(entity) {
    if (!entity.confirmationNumber) {
      entity.confirmationNumber = await this.generateConfirmationNumber();
    }
    
    const doc = new this.model(entity);
    const saved = await doc.save();
    await saved.populate('hotelId');
    return this.toEntity(saved);
  }

  toEntity(doc) {
    const booking = new Booking({
      id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone,
      email: doc.email,
      hotelId: doc.hotelId && typeof doc.hotelId === 'object' 
        ? doc.hotelId._id.toString() 
        : doc.hotelId ? doc.hotelId.toString() : null,
      roomId: doc.roomId ? doc.roomId.toString() : null,
      checkInDate: doc.checkInDate,
      checkOutDate: doc.checkOutDate,
      userId: doc.userId,
      confirmationNumber: doc.confirmationNumber,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });

    if (doc.hotelId && typeof doc.hotelId === 'object') {
      booking.hotel = {
        id: doc.hotelId._id.toString(),
        name: doc.hotelId.name,
        location: doc.hotelId.location
      };
    }

    return booking;
  }
}