var express = require('express');
var router = express.Router();
var Team = require('../models/team');

/****************
 ******GET*******
 ****************/

// Return a list of all teams
router.get('/', function(req, res, next) {
    Team.find(function(err, teams) {
        if (err) { return next(err); }
        res.json({'teams': teams});
    });
});

// Return the Team with the given ID
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    Team.findById(id, function(err, team) {
        if (err) { return next(err); }
        if (team === null) {
            return res.status(404).json({'message': 'Team not found'});
        }
        res.json(team);
    });
});

/****************
 ******POST******
 ****************/

// Create a new team
router.post('/', function(req, res, next) {
    var team = new Team(req.body);
    team.save(function(err) {
        if (err) { return next(err); }
        res.status(201).json(team);
    });
});

/****************
 *****DELETE*****
 ****************/


// Delete the player with the given ID
router.delete('/:id', function(req, res, next) {
    var id = req.params.id;
    Team.findOneAndDelete({_id: id}, function(err, team) {
        if (err) { return next(err); }
        if (team === null) {
            return res.status(404).json({'message': 'Team not found'});
        }
        res.json(team);
    });
});

//Delete all teams
router.delete('/', function(req, res, next){
    Team.find().deleteMany().exec(function(err, teams) {
        if (err) { return next(err); }
        res.json(teams);
    })
});

module.exports = router;
