const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sizeof = require('object-sizeof');
const responseHandler = require('../utils/response');
const tagsModel = new Schema({
    tagname: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        require: false
    },
    posts_count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { toJSON: { virtuals: true } })
tagsModel.set('toJSON', { getters: true });

tagsModel.options.toJSON.transform = (doc, ret) => {
    const obj = {...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};


const Tags = module.exports = mongoose.model('tags', tagsModel);

module.exports.getAllTags = async(result) => {
    try {
        const res = await Tags.find();

        if (!res) {
            result(responseHandler.response(false, 404, 'Tags not found', null));
        }
        result(null, responseHandler.response(true, 200, 'Success', res));
    } catch (err) {

    }
}

module.exports.getOneTags = async(tagname, result) => {
    try {

        const res = await Tags.findOne({ tagname: decodeURIComponent(tagname) });
        if (!res) {
            result(responseHandler.response(false, 404, 'Tags not found', null));
        }
        result(null, responseHandler.response(true, 200, 'Success', res));
    } catch (err) {

    }
}