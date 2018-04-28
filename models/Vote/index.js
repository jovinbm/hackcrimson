const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const voteSchema = new Schema({
  pollId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: String,
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

voteSchema.virtual('id').get(function() {
  return this._id.toHexString()
})

voteSchema.plugin(mongoosePaginate)

const Vote = mongoose.model('Vote', voteSchema)

module.exports = Vote
