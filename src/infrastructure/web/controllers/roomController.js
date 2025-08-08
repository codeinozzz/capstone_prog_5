import * as roomUseCases from '../../../application/usecases/roomUseCases.js';

export const createRoomController = (roomRepository, hotelRepository) => ({
  
  async create(req, res) {
    const result = await roomUseCases.createRoom(req.body, roomRepository, hotelRepository);
    
    result
      .onSuccess(room => {
        res.status(201).json({
          success: true,
          message: 'Room created successfully',
          data: room
        });
      })
      .onError(errorMsg => {
        res.status(400).json({
          success: false,
          error: errorMsg
        });
      });
  },

  async getAll(req, res) {
    const result = await roomUseCases.getAllRooms(roomRepository);
    
    result
      .onSuccess(rooms => {
        res.json({
          success: true,
          data: rooms,
          total: rooms.length
        });
      })
      .onError(errorMsg => {
        res.status(500).json({
          success: false,
          error: errorMsg
        });
      });
  },

  async getById(req, res) {
    const result = await roomUseCases.getRoomById(req.params.id, roomRepository);
    
    result
      .onSuccess(room => {
        res.json({
          success: true,
          data: room
        });
      })
      .onError(errorMsg => {
        res.status(404).json({
          success: false,
          error: errorMsg
        });
      });
  },

  async getByHotel(req, res) {
    const result = await roomUseCases.getRoomsByHotel(req.params.hotelId, roomRepository, hotelRepository);
    
    result
      .onSuccess(rooms => {
        res.json({
          success: true,
          data: rooms,
          total: rooms.length,
          hotelId: req.params.hotelId
        });
      })
      .onError(errorMsg => {
        res.status(404).json({
          success: false,
          error: errorMsg
        });
      });
  },

  async update(req, res) {
    const result = await roomUseCases.updateRoom(req.params.id, req.body, roomRepository);
    
    result
      .onSuccess(room => {
        res.json({
          success: true,
          message: 'Room updated successfully',
          data: room
        });
      })
      .onError(errorMsg => {
        res.status(400).json({
          success: false,
          error: errorMsg
        });
      });
  },

  async delete(req, res) {
    const result = await roomUseCases.deleteRoom(req.params.id, roomRepository);
    
    result
      .onSuccess(room => {
        res.json({
          success: true,
          message: 'Room deleted successfully',
          data: room
        });
      })
      .onError(errorMsg => {
        res.status(404).json({
          success: false,
          error: errorMsg
        });
      });
  },

  async searchAvailable(req, res) {
    const result = await roomUseCases.searchRooms(req.query, roomRepository);
    
    result
      .onSuccess(rooms => {
        res.json({
          success: true,
          message: rooms.length > 0 ? `Found ${rooms.length} available room(s)` : 'No rooms found',
          data: rooms,
          total: rooms.length,
          filters: req.query
        });
      })
      .onError(errorMsg => {
        res.status(400).json({
          success: false,
          error: errorMsg
        });
      });
  },

  async getTypes(req, res) {
    const result = await roomUseCases.getRoomTypes();
    
    result
      .onSuccess(types => {
        res.json({
          success: true,
          data: types
        });
      })
      .onError(errorMsg => {
        res.status(500).json({
          success: false,
          error: errorMsg
        });
      });
  }

});