/**
 * Created by kimilsik on 7/7/17.
 */

var router = require('express').Router();

module.exports = function (passport) {
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var conn = require('./config/db')();

    router.post(
        '/login',
        passport.authenticate(
            'local',
            {
                successRedirect: '/topic',
                failureRedirect: '/auth/login',
                failureFlash: false // login 페이지로 이동될 때 인증에 실패했다라는 메시지를 보여준다.
                // 아직은 복잡도가 높아서 나중에 사용.
            }
        )
    );

    router.get('/login', function(req, res) { // p태그는 줄바꿈을 위함.
        var sql = 'select id, title from topic';
        conn.query(sql, function(err, rows, fields) {
            res.render('auth/login', {test: 1, topics : rows, user : req.user});
        });
    });

    router.post('/register', function(req, res) {
        // hashing by pbkdf2
        hasher({password:req.body.password}, function(err, pass, salt, hash) {
            var user = {
                authId : 'local:'+req.body.username,
                salt : salt,
                username : req.body.username,
                password : hash,
                displayName : req.body.displayName
            };

            var sql = 'insert into users (authId, salt, username, password, displayName, email) ' +
                'values (:authId, :salt, :username, :password, :displayName, :email'

            var sql = 'INSERT INTO topic2 (title, description) VALUES(:title, :descr)';

            var sql = 'INSERT INTO users SET ?';
            conn.query(sql, user, function(err, results) {
                if (err) {
                    console.log(err);
                    res.status(500);
                } else {
                    req.login(user, function(err) {
                        req.session.save(function() {
                            res.redirect('/topic');
                        });
                        // req.session.save(function() {
                        //     res.redirect('/topic');
                        // });

                    });
                }
            });
        });
    });

    router.get('/register', function(req, res)
    {
        var sql = 'select id, title from topic';
        conn.query(sql, function(err, rows, fields) {
            res.render('auth/register', {topics:rows});
        });
    });

    router.get('/logout', function(req, res) {
        req.logout(); // request 의 logout method 를 호출한다.
        //delete req.session.displayName; // javascript command
        req.session.destroy(function (err) {
            console.log('logout done!');
            res.redirect('/topic');
        });
        // req.session.save(function (err) {
        //     console.log('logout done!');
        //     res.redirect('/topic');
            // db에서는 이상한 웰컴 화면이 뜨는게 발생하지 않는다...
            // destroy를 쓰면 로그아웃이 안되는 경우가 발생한다. 왜 그럴까.
        //});
    });

    router.get('/facebook', passport.authenticate('facebook', {
            scope : 'email'
        }
    ));

    router.get('/facebook/callback', passport.authenticate('facebook', {
            successRedirect : '/topic',
            failureRedirect : '/auth/login'
        })
    );

    return router;
};



