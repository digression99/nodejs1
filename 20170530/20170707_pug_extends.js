/**
 * Created by kimilsik on 7/7/17.
 */

/*
there is a redundant code in add and view


 */


var express = require('express');
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.listen(3003, function() {
    console.log('connect 3003 port');
});

app.get('/', function(req, res) {
    res.render('view');
});

app.get('/add', function(req, res) {
    res.render('add');
});
