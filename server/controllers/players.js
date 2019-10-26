var express = require('express');
var router = express.Router();
var Player = require('../models/player');

/****************
 ******GET*******
 ****************/

// Return a list of all players
router.get('/', function(req, res, next) {
    Player.find(function(err, players) {
        if (err) { return next(err); }
        res.json({'players': players});
    });
});

// Return the player with the given ID
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    Player.findById(id, function(err, player) {
        if (err) { return next(err); }
        if (player === null) {
            return res.status(404).json({'message': 'Player not found'});
        }
        res.json(player);
    });
});

/****************
 ******POST******
 ****************/

// Create a new player
router.post('/', function(req, res, next) {
    var player = new Player(req.body);
    player.save(function(err) {
        if (err) { return next(err); }
        res.status(201).json(player);
    });
});

/****************
 *****DELETE*****
 ****************/


// Delete the player with the given ID
router.delete('/:id', function(req, res, next) {
    var id = req.params.id;
    Player.findOneAndDelete({_id: id}, function(err, player) {
        if (err) { return next(err); }
        if (player === null) {
            return res.status(404).json({'message': 'Player not found'});
        }
        res.json(player);
    });
});

//Delete all players
router.delete('/', function(req, res, next){
    Player.find().deleteMany().exec(function(err, players) {
        if (err) { return next(err); }
        res.json(players);
    })
});

module.exports = router;
