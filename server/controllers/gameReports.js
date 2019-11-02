var express = require('express');
var router = express.Router();
var GameReport = require('../models/gameReport');
var mongoose = require('mongoose');
var pdfjs = require('pdfjs-dist');
var fs = require('fs');

// Return a list of all game reports
router.get('/', function (req, res, next) {

    GameReport.find(function (err, gameReports) {
        if (err) { return next(err); }
        res.json({ 'Game reports': gameReports });
    });
});

// Create a new player
router.post('/', function (req, res, next) {

    //Variables
    const PDF_SRC = 'files/20191026-BIF-LIF-PlayerReport.pdf';
    const RESPONSE_I_VALUE = 0;
    const RESPONSE_K_VALUE = 1;
    var data = new Uint8Array(fs.readFileSync(PDF_SRC));
    var players = [];
    var goals = [];
    var assits = [];
    var shotsOnGoal = [];
    var plusMinus = [];
    var gameInfo;
    var gameReport;

    //Functions
    function traverseArray(destination, array, position) {
        do {
            var item = array[position];
            position++;
        } while (item.str !== destination);

        return position;
    }

    function setPlayerInfo(textItems, k, i) {

        const ARRAY_NAME = 1;
        const ARRAY_SHOTS_ON_GOAL = 2;
        const ARRAY_GOALS = 3;
        const ARRAY_ASSITS = 4;
        const ARRAY_PLUS_MINUS = 6;
        const NEXT_PLAYER = 14;

        do {
            //var number = textItems[k].str;
            var name = textItems[k + ARRAY_NAME].str;
            players[i] = name;
            shotsOnGoal[i] = textItems[k + ARRAY_SHOTS_ON_GOAL].str;
            goals[i] = textItems[k + ARRAY_GOALS].str;
            assits[i] = textItems[k + ARRAY_ASSITS].str;
            plusMinus[i] = textItems[k + ARRAY_PLUS_MINUS].str;

            k = k + NEXT_PLAYER;
            i++;

        } while (textItems[k].str !== "Goalkeeper");

        return [i, k];
    }

    function saveGameReport(){
        gameReport = new GameReport({
            gameInfo : gameInfo

        });

        gameReport.save(function(err) {
            if (err) { return next(err); }
            res.status(201).json(gameReport);
        });
    }

    //Execution

    pdfjs.getDocument(data).promise.then(doc => {

        console.log("Page = " + doc._pdfInfo.numPages + " pages");

        doc.getPage(1).then(page => {
            page.getTextContent().then(textContent => {
                var textItems = textContent.items;
                var k = 0;
                var i = 0;

                gameInfo = textItems[0].str;

                //First team
                k = traverseArray("TOI", textItems, k);

                var response = setPlayerInfo(textItems, k, i);
                i = response[RESPONSE_I_VALUE];
                k = response[RESPONSE_K_VALUE];

                //Second team
                k = traverseArray("Player", textItems, k);
                k = traverseArray("TOI", textItems, k);

                response = setPlayerInfo(textItems, k, i);
                i = response[RESPONSE_I_VALUE];
                k = response[RESPONSE_K_VALUE];
            })
        })

    })
        .catch(error => {
            console.log(error);
        });

    setTimeout(saveGameReport, 0);

    /*setTimeout(function(){
        res.send();
    }, 0);*/
});






module.exports = router;