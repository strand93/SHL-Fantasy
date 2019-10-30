var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameReportSchema = new Schema({
    
    homeTeam : { type : String },
    awayTeam : { type : String },

    players : [ {type : mongoose.Schema.Types.ObjectId, ref:'players'} ],
    goals : [Number],
    assits : [Number],
    plusMinus : [Number],
    shotsOnGoal : [Number],
    
});

module.exports = mongoose.model('gameReports', gameReportSchema);