const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    Author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    answer_id: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})
module.exports = commentSchema;

commentSchema.set('toJSON', { getters: true });