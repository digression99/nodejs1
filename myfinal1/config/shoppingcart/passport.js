/**
 * Created by kimilsik on 7/11/17.
 */


module.exports = function(app, db) {
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;

    passport.use(new LocalStrategy(function(uname, pwd, done) {
        var sql = 'select from users where authId=:authId';

        db.query(sql, {params:{
            authId:'local:' + uname
        }}).then(function(results) {
            if (results.length === 0)
            {
                return done('id doesn\'t exists');
            }
            else
            {
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
    }));

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

            var sql = 'SELECT * FROM users WHERE authId=?';

            conn.query(sql, [auId], function(err, results) {
                if (results.length > 0) {
                    done(null, results[0]);
                } else {
                    // add the users to the table.
                    var newuser = {
                        authId : auId,
                        displayName : profile.displayName,
                        email : profile.emails[0].value
                    };
                    var sql = 'INSERT INTO users SET ?';
                    conn.query(sql, newuser, function(err, results) {
                        if (err) {
                            console.log(err);
                            done('error');
                        } else {
                            done(null, newuser);
                        }
                    });
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

        var sql = 'select from users where authId=:authId';

        db.query(sql, {params:{authId:id}}).then(function(results) {
            if (results.length !== 0) {
                done(null, results[0]);
            } else {
                done(null, false);
            }
        });
    });

    return passport;
};


