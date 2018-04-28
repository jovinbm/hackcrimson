const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const pollSchema = new Schema({
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

pollSchema.virtual('id').get(function() {
  return this._id.toHexString()
})

pollSchema.plugin(mongoosePaginate)

const Poll = mongoose.model('Poll', pollSchema)

module.exports = Poll
