export class BaseRepository {
  async create(data) {
    throw new Error('create method not implemented');
  }

  async findById(id) {
    throw new Error('findById method not implemented');
  }

  async findAll() {
    throw new Error('findAll method not implemented');
  }

  async update(id, data) {
    throw new Error('update method not implemented');
  }

  async delete(id) {
    throw new Error('delete method not implemented');
  }
}
