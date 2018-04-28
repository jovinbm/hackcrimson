const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const entitySchema = new Schema({
  pollId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
}, {
  toObject: {
    getters: true,
    // include virtuals like id field
    virtuals: true,
  },
  timestamps: {
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
  },
})

entitySchema.virtual('id').get(function() {
  return this._id.toHexString()
})

entitySchema.plugin(mongoosePaginate)

const Entity = mongoose.model('Entity', entitySchema)

module.exports = Entity
