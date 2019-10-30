var express = require('express');
var router = express.Router();
var Player = require('../models/player');
var mongoose = require('mongoose');

/****************
 ******GET*******
 ****************/

// Return a list of all players
router.get('/', function(req, res, next) {
    var team = req.query.team;
    var sort = req.query.sort;

    if(team||sort){next(); return};

    Player.find(function(err, players) {
        if (err) { return next(err); }
        res.json({'players': players});
    });
});

//Return a list of all players for a specific team
router.get('/', function(req, res, next) {
    var team = req.query.team;
    var sort = req.query.sort;
    
    if(sort){next(); return};

    Player.find({'team' : team})
    .exec(function(err, players) {
        if (err) { return next(err); }
        if(!players.length){
            var message = "No players found for team " + team;
            return res.status(404).json({'message': message}); 
        }
        res.json({'players': players});
    });
});

// Return a list of all players sorted by team
router.get('/', function(req, res, next) {
    var sort = req.query.sort;
    var sortBy = sort.slice(1);
    if(sortBy == "value" && sort.charAt(0) == '-'){
        Player.find().sort({'value' : -1})
        .exec(function(err, players) {
            if (err) { return next(err); }
            res.json({'players': players});
        });
    }else if(sortBy == "value"){
        Player.find().sort({'value' : 1})
        .exec(function(err, players) {
            if (err) { return next(err); }
            res.json({'players': players});
        });
    }else{
        var message = "Sort by " + sort + " not possible."
        res.status(404).send({'message' : message});
    }
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


/****************
 ******EDIT******
 ****************/

//PATCH one player

router.patch('/:id', function(req, res, next) {
    var id = req.params.id;
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(404).json({message: "Player not found"}); // They didn't send an object ID
    }
    Player.findById({_id: id}, function(err, player) {
        if (err) { return next(err); }
        if (player === null) {
            return res.status(404).json({'message': 'Player not found'});
        }
        player.name = (req.body.name || player.name);
        player.number = (req.body.number || player.number);
        player.team = (req.body.team || player.team);
        player.position = (req.body.position || player.position);
        player.value = (req.body.value || player.value);
        player.save();
        res.json(player);
    });
});



module.exports = router;
