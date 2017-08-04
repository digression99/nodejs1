/**
 * Created by kimilsik on 7/7/17.
 */

/*
if there's too many routers like thousand..
and you want to group routers by similiarity.

router level middleware.
-> router = express.router();


 var p1 = require('./routes/p1')(app); -> the object app is delivered to p1.js
 */

var express = require('express');
var app = express();

var p1 = require('./routes/p1')(app);
var p2 = require('./routes/p2')(app);

app.use('/p1', p1);
app.use('/p2', p2);

app.listen(3003, function() {
    console.log('connect 3003 port');
});