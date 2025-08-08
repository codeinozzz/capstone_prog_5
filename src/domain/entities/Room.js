export class Room {
  constructor(data) {
    this.id = data.id;
    this.hotelId = data.hotelId;
    this.type = data.type;
    this.capacity = data.capacity;
    this.beds = data.beds;
    this.price = data.price;
    this.available = data.available !== false;
    this.amenities = data.amenities || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  update(newData) {
    if (newData.type) this.type = newData.type;
    if (newData.capacity) this.capacity = newData.capacity;
    if (newData.beds) this.beds = newData.beds;
    if (newData.price !== undefined) this.price = newData.price;
    if (newData.available !== undefined) this.available = newData.available;
    if (newData.amenities) this.amenities = newData.amenities;
    this.updatedAt = new Date();
  }

  canFit(numberOfPeople) {
    return this.available && this.capacity >= numberOfPeople;
  }
}
