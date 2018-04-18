const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const List = new Schema({
    name : String,
    ready : Boolean
});

module.exports = mongoose.model('List', List);