export class Booking {
  constructor(data) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phone = data.phone;
    this.email = data.email;
    this.hotelId = data.hotelId;
    this.roomId = data.roomId;
    this.confirmationNumber = data.confirmationNumber;
    this.status = data.status || 'confirmed';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive() {
    return this.status === 'confirmed';
  }

  cancel() {
    this.status = 'cancelled';
    this.updatedAt = new Date();
  }
}