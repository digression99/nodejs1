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


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var fs = require('fs'); // file system
var mysql = require('mysql');

var conn = mysql.createConnection({
    host : 'localhost',
    user : 'kimilsik',
    password : 'kimilsik',
    database : 'o2'
});

conn.connect();

app.use(bodyParser.urlencoded({extended : false}));

app.locals.pretty = true;

app.set('views', './view_mysql');
app.set('view engine', 'pug');

// if connected in port 3000, function is called.
app.listen(3000, function() {
    console.log('connected, 3000 port!');
});



app.get('/topic/add', function(req, res) {
    var sql = 'select id, title from topic';
    conn.query(sql, function(err, rows, fields) {

        if (err)
        {
            console.log(err);
            res.status(500).send("internal server error");
        }
        res.render('add', {topics:rows});
    });
});

// topic으로 들어온 액션을 라우팅한다.
app.post('/topic/add', function(req, res) {
    var title = req.body.title;
    var desc = req.body.description;
    var author = req.body.author;

    var sql = 'insert into topic (title, description, author) values' +
        '(?, ?, ?)';
    conn.query(sql, [title, desc, author], function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('internal server error');
        }
        else
        {
            //res.send(rows.insertId);
            res.redirect('/topic/' + rows.insertId);
        }
    });
});

app.get(['/topic/:id/edit'], function(req, res) {
    var sql = 'select id, title from topic';
    conn.query(sql, function(err, rows, fields) {
        var id = req.params.id;

        if (id)
        {
            var sql = 'select * from topic where id=?';
            conn.query(sql, [id], function(err, top, fields) {
                if (err) {
                    console.log(err);
                }
                else
                {
                    res.render('edit', {topics:rows, top:top[0]});
                }
            })
        }
        else
        {
            console.log('no id');
            res.status(500).send('internal server error');
            //res.render('view', {topics:rows});
        }
        //res.render('view', {topics:rows, top:rows[id]});
        //res.send(rows);
    });
});

app.post(['/topic/:id/edit'], function(req, res) {

    var sql = 'update topic set title=?, description=?, author=? where id=?';

    var title = req.body.title;
    var desc = req.body.description;
    var author = req.body.author;
    var id = req.params.id;

    conn.query(sql, [title, desc, author, id], function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('internal server error');
        }
        else
        {
            res.redirect('/topic/' + id);
        }
    })
});

app.get(['/topic/:id/delete'], function(req, res) {
    var sql1 = 'select id, title from topic';
    var id = req.params.id;
    conn.query(sql1, function(err, rows, fields) {
        var sql2 = 'select * from topic where id=?';
        conn.query(sql2, [id], function(err, top, fds) {
            if (err)
            {
                console.log(err);
                res.status(500).send('internal error');
            }
            else
            {
                if (top.length === 0)
                {
                    console.log('no record.');
                    res.status(500).send('internal error');
                }
                else
                {
                    res.render('delete', {topics:rows, top:top[0]});
                }
            }
        });
    });
});

app.post('/topic/:id/delete', function(req, res) {
    var id = req.params.id;
    var sql = 'delete from topic where id=?';

    conn.query(sql, [id], function(err, result) {
        res.redirect('/topic/');
        //res.send(result);
    });
});

app.get(['/topic', '/topic/:id'], function(req, res) {
    var sql = 'select id, title from topic';
    conn.query(sql, function(err, rows, fields) {
        var id = req.params.id;

        if (id)
        {
            var sql = 'select * from topic where id=?';
            conn.query(sql, [id], function(err, top, fields) {
                if (err) {
                    console.log(err);
                }
                else
                {
                    res.render('view', {topics:rows, top:top[0]});
                }
            });
        }
        else
        {
            res.render('view', {topics:rows});
        }
        //res.render('view', {topics:rows, top:rows[id]});
        //res.send(rows);
    });
});










