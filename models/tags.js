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
// tagsModel.virtual('id').get(function() {
//     return this._id;
// });
// tagsModel.set('toJSON', {
//     virtuals: true,
//     transform: function(doc, ret) {
//         delete ret._id;
//         delete ret.__v;
//     }
// });

const Tags = module.exports = mongoose.model('tags', tagsModel);

module.exports.getAllTags = async(result) => {
    const res = await Tags.find();

    if (!res) {
        result(responseHandler.response(false, 404, 'Tags not found', null));
    }
    result(null, responseHandler.response(true, 200, 'Success', res));
}

module.exports.getOneTags = async(tagname, result) => {
    const res = await Tags.findOne({ tagname: tagname });

    if (!res) {
        result(responseHandler.response(false, 404, 'Tags not found', null));
    }
    result(null, responseHandler.response(true, 200, 'Success', res));
}