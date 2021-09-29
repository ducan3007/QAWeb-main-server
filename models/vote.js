const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  vote: {
    type: Number,
    default: 0
  }
});

module.exports = voteSchema