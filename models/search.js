const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const searchSchema = new Schema({
    query: { type: String },
    date: { type: Date, default: Date.now() }
});

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;
