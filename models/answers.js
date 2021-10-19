const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = require('./comment');
const answerSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
})
module.exports = mongoose.model('answers', answerSchema);