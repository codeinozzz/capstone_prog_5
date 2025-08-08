import mongoose from 'mongoose';

const isValidObjectId = (id) => {
  return id && mongoose.Types.ObjectId.isValid(id);
};

export const validateRequest = (req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return next();
  }
  
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Request body is required'
    });
  }
  
  if (req.path.includes('/hotels')) {
    const { name, location, description } = req.body;
    
    if (req.method === 'POST') {
      console.log("debuggin")
      if (!name || name.length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Hotel name must be at least 3 characters'
        });
      }
      if (!location || location.length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Hotel location must be at least 3 characters'
        });
      }
      if (!description || description.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Hotel description must be at least 10 characters'
        });
      }
    }
    
    if (req.method === 'PUT') {
      if (name !== undefined && (!name || name.length < 3)) {
        return res.status(400).json({
          success: false,
          error: 'Hotel name must be at least 3 characters'
        });
      }
      if (location !== undefined && (!location || location.length < 3)) {
        return res.status(400).json({
          success: false,
          error: 'Hotel location must be at least 3 characters'
        });
      }
      if (description !== undefined && (!description || description.length < 10)) {
        return res.status(400).json({
          success: false,
          error: 'Hotel description must be at least 10 characters'
        });
      }
    }
    
    if (req.body.rating !== undefined && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }
  }
  
  if (req.path.includes('/rooms')) {
    const { hotelId, type, capacity } = req.body;
    const validTypes = ['individual_1', 'individual_2', 'individual_3', 'suite_2', 'suite_family'];
    
    if (req.method === 'POST') {
      if (!hotelId || !isValidObjectId(hotelId)) {
        return res.status(400).json({
          success: false,
          error: 'Valid hotel ID is required'
        });
      }
      if (!type || !validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          error: `Room type must be one of: ${validTypes.join(', ')}`
        });
      }
      if (!capacity || capacity < 1 || capacity > 4) {
        return res.status(400).json({
          success: false,
          error: 'Capacity must be between 1 and 4'
        });
      }
    }
    
    if (req.method === 'PUT') {
      // CAMBIO AQUÍ: validar ObjectId en lugar de número
      if (hotelId !== undefined && (!hotelId || !isValidObjectId(hotelId))) {
        return res.status(400).json({
          success: false,
          error: 'Valid hotel ID is required'
        });
      }
      if (type !== undefined && (!type || !validTypes.includes(type))) {
        return res.status(400).json({
          success: false,
          error: `Room type must be one of: ${validTypes.join(', ')}`
        });
      }
      if (capacity !== undefined && (!capacity || capacity < 1 || capacity > 4)) {
        return res.status(400).json({
          success: false,
          error: 'Capacity must be between 1 and 4'
        });
      }
    }
    
    if (req.body.price !== undefined && req.body.price < 0) {
      return res.status(400).json({
        success: false,
        error: 'Price cannot be negative'
      });
    }
  }
  
  next();
};