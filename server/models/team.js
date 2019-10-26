var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    name : { type : String, required : true, unique : true },
    teamValue : { type : Number},
    rightForward : { type: mongoose.Schema.Types.ObjectId, ref:'players', required : true},
    leftForward : { type: mongoose.Schema.Types.ObjectId, ref:'players', required : true},
    center : { type: mongoose.Schema.Types.ObjectId, ref:'players', required : true},
    rightDefense : { type: mongoose.Schema.Types.ObjectId, ref:'players', required : true},
    leftDefense : { type: mongoose.Schema.Types.ObjectId, ref:'players', required : true},
    goalkeeper : { type: mongoose.Schema.Types.ObjectId, ref:'players', required : true}
});

module.exports = mongoose.model('teams', teamSchema);