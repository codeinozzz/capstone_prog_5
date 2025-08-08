import * as hotelUseCases from '../../../application/usecases/hotelUseCases.js';

export const createHotelController = (hotelRepository) => ({
  
  async create(req, res) {
    const result = await hotelUseCases.createHotel(req.body, hotelRepository);
    
    result
      .onSuccess(hotel => {
        res.status(201).json({
          success: true,
          message: 'Hotel created successfully',
          data: hotel
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
    const result = await hotelUseCases.getAllHotels(hotelRepository);
    
    result
      .onSuccess(hotels => {
        res.json({
          success: true,
          data: hotels,
          total: hotels.length
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
    const result = await hotelUseCases.getHotelById(req.params.id, hotelRepository);
    
    result
      .onSuccess(hotel => {
        res.json({
          success: true,
          data: hotel
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
    const result = await hotelUseCases.updateHotel(req.params.id, req.body, hotelRepository);
    
    result
      .onSuccess(hotel => {
        res.json({
          success: true,
          message: 'Hotel updated successfully',
          data: hotel
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
    const result = await hotelUseCases.deleteHotel(req.params.id, hotelRepository);
    
    result
      .onSuccess(hotel => {
        res.json({
          success: true,
          message: 'Hotel deleted successfully',
          data: hotel
        });
      })
      .onError(errorMsg => {
        res.status(404).json({
          success: false,
          error: errorMsg
        });
      });
  },

  async search(req, res) {
    const result = await hotelUseCases.searchHotels(req.query, hotelRepository);
    
    result
      .onSuccess(hotels => {
        res.json({
          success: true,
          data: hotels,
          total: hotels.length,
          filters: req.query
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