/**
 * Created by kimilsik on 7/11/17.
 */

module.exports = function (passport, db) {
    var router = require('express').Router();
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();

    router.get('/login', function(req, res) {
        res.render('shoppingcart/login');
    });

    router.post('/login', passport.authenticate('local',
            {
                successRedirect: '/shoppingcart/table/main',
                failureRedirect: '/shoppingcart/login',
                failureFlash: false // login 페이지로 이동될 때 인증에 실패했다라는 메시지를 보여준다.
                // 아직은 복잡도가 높아서 나중에 사용.
            }
        )
    );

    router.get('/register', function(req, res) {
        res.render('shoppingcart/register');
    });

    router.post('/register', function(req, res) {

        var sql = 'select authId from users where authId=:authId';

        db.query(sql, {
            params : {
                authId : 'local:' + req.body.username
            }
        }).then(function(results) {
            if (results.length === 0)
            {
                // no same authId. it's ok to make the id.
                // hashing by pbkdf2
                hasher({password:req.body.password}, function(err, pass, salt, hash) {
                    var user = {
                        authId : 'local:'+req.body.username,
                        salt : salt,
                        username : req.body.username,
                        password : hash,
                        displayName : req.body.displayName,
                        email : req.body.email
                    };
                    // 여기서 insert한다. 그 앞에서 중복 체크를 해야 한다.
                    var sql = 'insert into users (authId, salt, username, password, displayName, email) ' +
                        'values (:authId, :salt, :username, :password, :displayName, :email)';

                    db.query(sql, {
                        params : user // then 이 실행되면 push가 된 것.
                    }).then(function(results) {
                        //req.login();
                        // 여기서 실패하면 이미 저장된 아이디는 통제 불가이므로,
                        // 실패했을 시 다시 지워버리는 코드가 필요하다..
                        req.login(user, function(err) {
                            req.session.save(function() {
                                res.redirect('/shoppingcart/table/main');
                            });
                        });
                    }, function(err) {
                        // then 이 promise인데 여기에서는 에러가 발생하면 두번째 인자로 주어진
                        // 함수가 호출된다
                        console.log(err);
                        res.status(500);
                    });

                    // passport 가 넣어주는 함수 -> login()
                    // req.login(user, function(err) {
                    //     req.session.save(function() {
                    //         res.redirect('/');
                    //     });
                    // });
                });
            }
            else
            {
                // has a same authId in database. you should send a message to pug document.
                res.render('register_error',{message : 'same ID exists.'});
                // render랑 redirect랑 어떻게 다를까...
                //res.redirect('register_error', {message : 'same ID exists.'})
            }

        });
    });

    router.get('/logout', function(req, res) {
        req.logout(); // request 의 logout method 를 호출한다.
        //delete req.session.displayName; // javascript command
        req.session.save(function (err) {
            console.log('logout done!');
            res.redirect('/shoppingcart');
            // db에서는 이상한 웰컴 화면이 뜨는게 발생하지 않는다...
            // destroy를 쓰면 로그아웃이 안되는 경우가 발생한다. 왜 그럴까.
        });
        // req.session.destroy(function (err) {
        //     console.log('logout done!');
        //     res.redirect('/welcome');
        // });
    });

    return router;
};


