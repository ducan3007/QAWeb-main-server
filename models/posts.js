const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = require('./comments');
const answerSchema = require('./answers');
const tagSchema = require('./tags');
const votes = require('./vote');

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: [commentSchema],
    tags: [tagSchema],
    views: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('posts', postSchema);