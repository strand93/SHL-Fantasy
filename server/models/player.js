var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
    name: { type: String },
    number: { type: Number},
    team: { type: String },
    position: { type: String }, 
    value : { type: Number }
});

module.exports = mongoose.model('players', playerSchema);