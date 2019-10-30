var express = require('express');
var router = express.Router();
var GameReport = require('../models/gameReport');
var mongoose = require('mongoose');

// Return a list of all game reports
router.get('/', function(req, res, next) {

    GameReport.find(function(err, gameReports) {
        if (err) { return next(err); }
        res.json({'Game reports': gameReports});
    });
});

// Create a new player
router.post('/', function(req, res, next) {

    


    var gameReport = new gameReport({

    });
    player.save(function(err) {
        if (err) { return next(err); }
        res.status(201).json(player);
    });
});






module.exports = router;