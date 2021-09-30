const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    token: { type: Object },
});

module.exports = mongoose.model('Token', taskSchema);