/**
 * Created by kimilsik on 7/11/17.
 */
module.exports = function(passport) {

    var router = require('express').Router();
    var db = require('../config/db')();
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();

    router.get('/logout', function(req, res) {
        req.logout(); // request 의 logout method 를 호출한다.
        //delete req.session.displayName; // javascript command
        req.session.save(function (err) {
            console.log('logout done!');
            res.redirect('/welcome');
            // db에서는 이상한 웰컴 화면이 뜨는게 발생하지 않는다...
            // destroy를 쓰면 로그아웃이 안되는 경우가 발생한다. 왜 그럴까.
        });
        // req.session.destroy(function (err) {
        //     console.log('logout done!');
        //     res.redirect('/welcome');
        // });
    });

    router.get('/facebook', passport.authenticate(
        'facebook',
        {
            scope : 'email'
        }
    ));

    router.get('/facebook/callback', passport.authenticate('facebook',
        {
            successRedirect : '/welcome',
            failureRedirect : '/auth/login'
        })
    );

    router.post(
        '/login',
        passport.authenticate(
            'local',
            {
                successRedirect: '/welcome',
                failureRedirect: '/auth/login',
                failureFlash: false // login 페이지로 이동될 때 인증에 실패했다라는 메시지를 보여준다.
                // 아직은 복잡도가 높아서 나중에 사용.
            }
        )
    );

    router.get('/login', function(req, res) { // p태그는 줄바꿈을 위함.
        res.render('auth/login');
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

            var sql = 'insert into user (authId, username, password, salt, displayName) ' +
                'values (:authId, :username, :password, :salt, :displayName)';
            db.query(sql, {
                params : user // then 이 실행되면 push가 된 것.
            }).then(function(results) {
                req.login()


            }, function(err) {
                // then 이 promise인데 여기에서는 에러가 발생하면 두번째 인자로 주어진
                // 함수가 호출된다
                console.log(err);
                res.status(500);
            });

            // passport 가 넣어주는 함수 -> login()
            req.login(user, function(err) {
                req.session.save(function() {
                    res.redirect('/welcome');
                });
            });
        });
    });

    router.get('/register', function(req, res)
    {
        res.render('auth/register');
    });

    return router;
};