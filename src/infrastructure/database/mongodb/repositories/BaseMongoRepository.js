import { BaseRepository } from '../../../../domain/ports/BaseRepository.js';

export class BaseMongoRepository extends BaseRepository {
  constructor(model, entityClass) {
    super();
    this.model = model;
    this.entityClass = entityClass;
  }

  async create(entity) {
    const doc = new this.model(entity);
    const saved = await doc.save();
    return this.toEntity(saved);
  }

  async findById(id) {
    const doc = await this.model.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll() {
    const docs = await this.model.find();
    return docs.map(doc => this.toEntity(doc));
  }

  async update(id, updateData) {
    const doc = await this.model.findByIdAndUpdate(id, updateData, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id) {
    const doc = await this.model.findByIdAndDelete(id);
    return doc ? this.toEntity(doc) : null;
  }

  toEntity(doc) {
    throw new Error('toEntity method must be implemented by subclasses');
  }
}