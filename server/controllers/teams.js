var express = require('express');
var router = express.Router();
var Team = require('../models/team');
var mongoose = require('mongoose');

/****************
 ******GET*******
 ****************/

// Return a list of all teams and populate players
router.get('/', function(req, res, next) {
    Team.find()
    .populate('leftForward')
    .populate('rightForward')
    .populate('center')
    .populate('leftDefense')
    .populate('rightDefense')
    .populate('goalkeeper')
    .exec(function(err, teams) {
        if (err) { return next(err); }
        res.json({'teams': teams});
    });
});

// Return the Team with the given ID
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    Team.findById(id)
    .populate('leftForward')
    .populate('rightForward')
    .populate('center')
    .populate('leftDefense')
    .populate('rightDefense')
    .populate('goalkeeper')
    .exec(function(err, team) {
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

/****************
 ******EDIT******
 ****************/

//PATCH one team

router.patch('/:id', function(req, res, next) {
    var id = req.params.id;
    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(404).json({message: "Team not found"}); // They didn't send an object ID
    }
    Team.findById({_id: id}, function(err, team) {
        if (err) { return next(err); }
        if (team === null) {
            return res.status(404).json({'message': 'Team not found'});
        }
        team.name = (req.body.name || team.name);
        team.teamValue = (req.body.teamValue || team.teamValue);
        team.rightForward = (req.body.rightForward || team.rightForward);
        team.leftForward = (req.body.leftForward || team.leftForward);
        team.center = (req.body.center || team.center);
        team.leftDefense = (req.body.leftDefense || team.leftDefense);
        team.rightDefense = (req.body.rightDefense || team.rightDefense);
        team.goalkeeper = (req.body.goalkeeper || team.goalkeeper);
        team.save();
        res.json(team);
    });
});

module.exports = router;
