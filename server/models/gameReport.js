var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameReportSchema = new Schema({
    
    gameInfo : { type : String },
    
    //players : [ {type : mongoose.Schema.Types.ObjectId, ref:'players'} ],
    players : [String],
    goals : [Number],
    assits : [Number],
    plusMinus : [Number],
    shotsOnGoal : [Number],
    
});

module.exports = mongoose.model('gameReports', gameReportSchema);