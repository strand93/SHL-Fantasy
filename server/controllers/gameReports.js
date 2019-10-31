var express = require('express');
var router = express.Router();
var GameReport = require('../models/gameReport');
var mongoose = require('mongoose');
var pdfjs = require('pdfjs-dist');
var fs = require('fs');

// Return a list of all game reports
router.get('/', function(req, res, next) {

    GameReport.find(function(err, gameReports) {
        if (err) { return next(err); }
        res.json({'Game reports': gameReports});
    });
});

// Create a new player
router.post('/', function(req, res, next) {

    const PDF_SRC = 'files/20191026-BIF-LIF-PlayerReport.pdf';
    var data = new Uint8Array(fs.readFileSync(PDF_SRC));
    console.log("1");

    pdfjs.getDocument(data).then(doc => {
        
        console.log("Page = " + doc._pdfInfo.numPages + " pages");
        
        doc.getPage(1).then(page =>{
            page.getTextContent().then(textContent=>{
                console.log(textContent);
            })
        })
        
    })
    .catch(error =>{
        console.log(error);
    });

    /*var gameReport = new gameReport({

    });
    player.save(function(err) {
        if (err) { return next(err); }
        res.status(201).json(player);
    });*/
    res.send();
});






module.exports = router;