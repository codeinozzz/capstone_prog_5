const VALID_ROOM_TYPES = ['individual_1', 'individual_2', 'individual_3', 'suite_2', 'suite_family'];

export const validateRoomData = (data) => {
  if (!data.hotelId || isNaN(data.hotelId) || data.hotelId <= 0) {
    throw new Error('Valid hotel ID is required');
  }

  if (!data.type || !VALID_ROOM_TYPES.includes(data.type)) {
    throw new Error(`Room type must be one of: ${VALID_ROOM_TYPES.join(', ')}`);
  }

  if (!data.capacity || data.capacity < 1 || data.capacity > 4) {
    throw new Error('Capacity must be between 1 and 4');
  }

  if (data.price !== undefined && data.price < 0) {
    throw new Error('Price cannot be negative');
  }

  return true;
};

export const validateRoomId = (id) => {
  if (!id || isNaN(id) || id <= 0) {
    throw new Error('Valid room ID is required');
  }
  return true;
};

export const validateSearchFilters = (filters) => {
  if (filters.numberOfPeople && (isNaN(filters.numberOfPeople) || filters.numberOfPeople <= 0)) {
    throw new Error('Number of people must be greater than 0');
  }

  if (filters.minPrice && (isNaN(filters.minPrice) || filters.minPrice < 0)) {
    throw new Error('Minimum price must be positive');
  }

  if (filters.maxPrice && (isNaN(filters.maxPrice) || filters.maxPrice < 0)) {
    throw new Error('Maximum price must be positive');
  }

  if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
    throw new Error('Minimum price cannot be greater than maximum price');
  }

  return true;
};