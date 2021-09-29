const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagsModel = new Schema({
    name:{
        type:String, 
        required: true,
    }
})

module.exports = tagsModel;