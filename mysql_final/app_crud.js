/**
 * Created by kimilsik on 6/29/17.
 */

// get('topic/') : view.pug
// get('topic/:id') : view.pug
// get('topic/add') : add.pug
//     post('topic/add')
//     get('topic/:id') // redirection
// get('topic/:id/edit') : edit.pug
//     post('topic/:id/edit')
//     get('topic/:id')
// get('topic/:id/delete') : delete.pug
//     post('topic/:id/delete')
//     get('topic/') // redirection

var app = require('./config/express')();
//var fs = require('fs'); // file system
// var mysql = require('mysql');
//
// var conn = mysql.createConnection({
//     host : 'localhost',
//     user : 'kimilsik',
//     password : 'kimilsik',
//     database : 'o2'
// });
//
// conn.connect();

var topic = require('./config/topic')();
app.use('/topic', topic);

var passport = require('./config/passport')(app);
var auth = require('./auth')(passport);
app.use('/auth', auth);

// if connected in port 3000, function is called.
app.listen(3000, function() {
    console.log('connected, 3000 port!');
});