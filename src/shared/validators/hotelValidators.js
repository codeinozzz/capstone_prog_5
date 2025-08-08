export const validateHotelData = (data) => {
  if (!data.name || data.name.length < 3) {
    throw new Error('Hotel name must be at least 3 characters');
  }

  if (!data.location || data.location.length < 3) {
    throw new Error('Hotel location must be at least 3 characters');
  }

  if (!data.description || data.description.length < 10) {
    throw new Error('Hotel description must be at least 10 characters');
  }

  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  return true;
};

export const validateHotelId = (id) => {
  if (!id || isNaN(id) || id <= 0) {
    throw new Error('Valid hotel ID is required');
  }
  return true;
};