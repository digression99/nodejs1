/**
 * Created by kimilsik on 7/8/17.
 */

module.exports = function() {
    var router = require('express').Router();
    var conn = require('./db')();

    router.get('/add', function(req, res) {
        var sql = 'select id, title from topic';
        conn.query(sql, function(err, rows, fields) {

            if (err)
            {
                console.log(err);
                res.status(500).send("internal server error");
            }
            res.render('crud/add', {topics:rows, user : req.user});
        });
    });

    // topic으로 들어온 액션을 라우팅한다.
    router.post('/add', function(req, res) {
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

    router.get(['/:id/edit'], function(req, res) {
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
                        res.render('crud/edit', {topics:rows, top:top[0], user : req.user});
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

    router.post(['/:id/edit'], function(req, res) {

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
                // redirect는 router의 범위가 적용되지 않는다. 다 써줘야 한다.
                res.redirect('/topic/' + id);
            }
        })
    });

    router.get(['/:id/delete'], function(req, res) {
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
                        res.render('crud/delete', {topics:rows, top:top[0], user : req.user});
                    }
                }
            });
        });
    });

    router.post('/:id/delete', function(req, res) {
        var id = req.params.id;
        var sql = 'delete from topic where id=?';

        conn.query(sql, [id], function(err, result) {
            res.redirect('/topic');
            //res.send(result);
        });
    });

    router.get(['/', '/:id'], function(req, res) {
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
                        res.render('crud/view', {topics:rows, top:top[0], user : req.user});
                    }
                });
            }
            else
            {
                res.render('crud/view', {topics:rows, user : req.user});
            }
            //res.render('view', {topics:rows, top:rows[id]});
            //res.send(rows);
        });
    });
    return router;
};



