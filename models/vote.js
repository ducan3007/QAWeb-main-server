const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    vote: {
        type: Number,
        required: false
    }
}, {
    _id: false
});

module.exports = voteSchema