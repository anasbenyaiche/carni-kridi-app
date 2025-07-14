class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findById(id, populate = '') {
    const query = this.model.findById(id);
    if (populate) {
      query.populate(populate);
    }
    return await query.exec();
  }

  async findOne(filter, populate = '') {
    const query = this.model.findOne(filter);
    if (populate) {
      query.populate(populate);
    }
    return await query.exec();
  }

  async find(filter = {}, options = {}) {
    const {
      populate = '',
      sort = {},
      limit = null,
      skip = 0,
      select = ''
    } = options;

    let query = this.model.find(filter);
    
    if (populate) query = query.populate(populate);
    if (Object.keys(sort).length) query = query.sort(sort);
    if (select) query = query.select(select);
    if (skip > 0) query = query.skip(skip);
    if (limit) query = query.limit(limit);

    return await query.exec();
  }

  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { 
      new: true, 
      runValidators: true 
    });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  async aggregate(pipeline) {
    return await this.model.aggregate(pipeline);
  }
}

module.exports = BaseService;