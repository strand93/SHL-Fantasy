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

    const PDF_SRC = 'files/20191026-BIF-LIF-PlayerReport.pdf';
    const RESPONSE_I_VALUE = 0;
    const RESPONSE_K_VALUE = 1;
    var data = new Uint8Array(fs.readFileSync(PDF_SRC));
    var players = [];
    var goals = [];
    var assits = [];
    var shotsOnGoal = [];
    var plusMinus = [];

    console.log("1");

    pdfjs.getDocument(data).then(doc => {

        console.log("Page = " + doc._pdfInfo.numPages + " pages");

        doc.getPage(1).then(page => {
            page.getTextContent().then(textContent => {
                var textItems = textContent.items;
                var k = 0;
                //var item;
                var i = 0;

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

    function traverseArray(destination, array, position) {
        do {
            var item = array[position];
            position++;
        } while (item.str !== destination);

        return position;
    }

    function setPlayerInfo(textItems, k, i) {

        do {
            //var number = textItems[k].str;
            var name = textItems[k + 1].str;
            players[i] = name;
            shotsOnGoal[i] = textItems[k + 2].str;
            goals[i] = textItems[k + 3].str;
            assits[i] = textItems[k + 4].str;

            plusMinus[i] = textItems[k + 6].str;

            k = k + 14;
            i++;

        } while (textItems[k].str !== "Goalkeeper");

        return [i, k];
    }

    setTimeout(function(){
        console.log(players);
    }, 0);
    /*var gameReport = new gameReport({

    });
    player.save(function(err) {
        if (err) { return next(err); }
        res.status(201).json(player);
    });*/
    setTimeout(function(){
        res.send();
    }, 0);
});






module.exports = router;