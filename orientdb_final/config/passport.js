/**
 * Created by kimilsik on 7/11/17.
 */

module.exports = function (app) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;

    var db = require('./db')();
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(function(username, password, done) {
            var uname = username;
            var pwd = password;
            var sql = 'select from user where authId=:authId';
            db.query(sql, {params:{authId:'local:'+uname}}).then(function(results) {
                if (results.length === 0)
                {
                    // no results, no user
                    return done(null, false);
                }
                var user = results[0];
                return hasher({password:pwd, salt : user.salt}, function(err, pass, salt, hash) {
                    if (hash === user.password) {
                        console.log('local strategy', user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID : '1594918147219732',
            clientSecret : '76a5953a9487bb7e59d025ca9118851f',
            callbackURL : "/auth/facebook/callback",
            profileFields : ['id', 'email', 'gender', 'link', 'locale', 'name',
                'timezone', 'updated_time', 'verified', 'displayName']
        }, function(accessToken, refreshToken, profile, done) {
            console.log(profile); // -> id, username, displayName, name.familyName, name.givenName, name.middleName,
            // gender, profileUrl, provider 받는다. 이 중 id 가 제일 중요
            // 타사 인증을 통해 로그인한 사용자의 경우 다른 방법으로 정보를 접근해야 한다.

            var auId = 'facebook:'+profile.id;
            var sql = 'select from user where authId=:authId';

            db.query(sql, {params: {authId:auId}})
                .then(function(results) {
                    if (results.length === 0)
                    {
                        var newuser = {
                            authId : auId,
                            displayName : profile.displayName,
                            email : profile.emails[0].value
                        };
                        var sql = 'insert into user (authId, displayName, email) values (' +
                            ':authId, :displayName, :email)';
                        db.query(sql, {params:newuser})
                            .then(function() {
                                done(null, newuser);
                            }, function (err) {
                                console.log(err);
                                done('error');
                            });
                    } else {
                        return done(null, results[0]);
                    }
                });
        }
    ));

    passport.serializeUser(function(user, done)
    {
        console.log('serializeUser', user);
        return done(null, user.authId); // passport.use 에서 done이 호출될 때 자동으로 호출된다.
    });

    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser', id);

        var sql = 'select from user where authId=:authId';

        db.query(sql, {params : {authId : id}})
            .then(function(results) {
                if (results.length === 0) {
                    done('session store exists but there is no user data.');
                } else {
                    // 비밀번호는 읽어오지 않는게 좋다.
                    done(null, results[0]);
                }
            });
    });

    return passport;
};


