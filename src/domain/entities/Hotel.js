export class Hotel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location;
    this.description = data.description;
    this.rating = data.rating;
    this.amenities = data.amenities || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  update(newData) {
    if (newData.name) this.name = newData.name;
    if (newData.location) this.location = newData.location;
    if (newData.description) this.description = newData.description;
    if (newData.rating) this.rating = newData.rating;
    if (newData.amenities) this.amenities = newData.amenities;
    this.updatedAt = new Date();
  }
}