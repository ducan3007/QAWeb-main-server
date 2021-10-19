const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagsModel = new Schema({
    tagname: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        require: false
    },
    create_at:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('tags', tagsModel);