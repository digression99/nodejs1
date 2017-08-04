/**
 * Created by kimilsik on 7/7/17.
 */


// federation authentication

module.exports = function(app) {
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var assert = require("assert");
    var opts = { // opts는 options이다.
        password: "helloworld" // hasher 함수는 첫 번째 인자로 객체를 받고 그 객체 안에
        // password property가 있다면 그것을 암호화한다는 것을 추론한다.
    };
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var db = require('./db')();

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(function(username, password, done) {
            var uname = username;
            var pwd = password;

            var sql = 'SELECT * FROM users where authId=?';

            conn.query(sql, ['local:' + uname], function (err, results) {
                if (err || results.length <= 0) {
                    return done('there is no user.');
                } else {
                    var user = results[0];
                    return hasher({password:pwd, salt : user.salt}, function(err, pass, salt, hash) {
                        if (hash === user.password) {
                            console.log('local strategy.', user);
                            done(null, user);
                        } else {
                            done(null, false);
                        }
                    });
                }
            });
        }
    ));

    // passport.use(new LocalStrategy(function(username, password, done) {
    //
    //         var sql = 'SELECT * FROM users where authId=:authId';
    //
    //         db.query(sql, {
    //                 params:{
    //                         authId : 'local:'+ username
    //                         }
    //             }
    //         ).then(function (results) {
    //             if (results.length === 0)
    //             {
    //                 return done(null, false);
    //             }
    //             else
    //             {
    //                 var user = results[0];
    //
    //                 return hasher({password:password, salt:user.salt}, function(err, pass, salt, hash)
    //                 {
    //                     if (hash === user.password)
    //                     {
    //                         console.log('local strategy', user);
    //                         done(null, user);
    //                     }
    //                     else
    //                     {
    //                         done(null, false);
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // ));

    passport.serializeUser(function(user, done)
    {
        console.log('serializeUser', user);
        return done(null, user.authId); // passport.use 에서 done이 호출될 때 자동으로 호출된다.
    });

    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser', id);

        var sql = 'select from users where authId=:authId';

        db.query({params:{authId:id}}).then(function(results) {
           if (results.length === 0)
           {
               done(null, false);
           }
           else
           {
               done(null, results[0]);
           }
        });
    });

    return passport;
};


