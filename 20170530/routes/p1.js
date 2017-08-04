/**
 * Created by kimilsik on 7/7/17.
 */

var express = require('express');
var router = express.Router();

router.get('/r1', function(req, res) {
    res.send('hello /p1/r1');
});

router.get('/r2', function(req, res) {
    res.send('hello /p1/r2');
});

module.exports = function(app) {
    // the actions you wanna take with app object.

    return router;
};

