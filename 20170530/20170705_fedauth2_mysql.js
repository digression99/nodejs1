/**
 * Created by kimilsik on 7/5/17.
 */
/*

lesson 109 - mysql 로 데이터 저장하기

in mysql, UNIQUE (authId)
-> means that if there's a same authId exists in the table already,
then mysql refuses to accept it.

 select * from users\G; -> show the results in format.

table alternation
ALTER TABLE users ADD email VARCHAR(50);

-------------------

lesson 114 - jade extension ( 상속 )





 */


var express = require('express');
var app = express();
var session = require('express-session'); // 모듈
var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
var MySQLStore = require('express-mysql-session')(session);

//var fileStore = require('session-file-store')(session); // file 로 session을 저장하기 위한 것
//var fs = require('fs');
//var OrientoStore = require('connect-oriento')(session);
//var OrientDB = require('orientjs');

// for security
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var assert = require("assert");
var opts = { // opts는 options이다.
    password: "helloworld" // hasher 함수는 첫 번째 인자로 객체를 받고 그 객체 안에
    // password property가 있다면 그것을 암호화한다는 것을 추론한다.
};
// for security

// federation authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// federation authentication

// for database
var mysql = require('mysql');

var conn = mysql.createConnection({
    host : 'localhost',
    user : 'kimilsik',
    password : 'kimilsik',
    database : 'o2'
});

conn.connect();
// for database




app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    secret: 'oiwehrowhvjknasd1@34124901#!@', // random value
    resave : false, // session id 를 접속할 때 마다 새로 발급하는지
    saveUninitialized : true,
    store : new MySQLStore({ // mysql에 접속하기 위한 정보
        host :'localhost',
        port:3306,
        user:'kimilsik',
        password:'kimilsik',
        database:'o2' // 저 모듈이 자동으로 mysql에 sessions라는 테이블을 생성하고 데이터를 저장할 것이다
    })
    // 자동으로 orientdb 에 session 클래스가 생성된다.
}));

// federation authentication
app.use(passport.initialize());
app.use(passport.session());

app.listen(3004, function() {
    console.log('connected 3004 port!!!');
});

passport.use(new LocalStrategy(function(username, password, done) {
        var uname = username;
        var pwd = password;

        var sql = 'SELECT * FROM users where authId=?';

        conn.query(sql, ['local:' + uname], function (err, results) {
            if (err) {
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

    var sql = 'SELECT * FROM users WHERE authId=?';

    conn.query(sql, [id], function (err, results) {
        if (err) {
            console.log(err);
            done('there is no user');
        } else {
            done(null, results[0]);
        }
    });
});

// federation authentication

app.get('/auth/logout', function(req, res) {
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

app.get('/welcome', function(req, res) {
    // passport 를 이용하여 유저 정보에 접근해야.

    // passport 는 user라는 객체로 만들어준다.
    // login 에서 done객체의 users[i]가 user가 된다.
    if (req.user && req.user.displayName)
    //if (req.session.displayName)
    {
        res.send(`
        <h1>hello, ${req.user.displayName}</h1>
        <a href="/auth/logout">logout</a>
        `);
    }
    else
    {
        res.send(`
        <h1>Welcome</h1>
        <a href="/auth/login">Login</a>
        <a href="/auth/register">Register</a>
        `);
    }
});

app.get('/auth/facebook', passport.authenticate('facebook', {
        scope : 'email'
    }
));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/welcome',
        failureRedirect : '/auth/login'
    })
);

app.post(
    '/auth/login',
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

app.get('/auth/login', function(req, res) { // p태그는 줄바꿈을 위함.
    var output = `
    <h1>LOGIN</h1>
    <form action="/auth/login" method="post">
        <p> 
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    <a href="/auth/facebook">facebook</a>
    `;
    res.send(output);
});

app.post('/auth/register', function(req, res) {
    // hashing by pbkdf2
    hasher({password:req.body.password}, function(err, pass, salt, hash) {
        var user = {
            authId : 'local:'+req.body.username,
            salt : salt,
            username : req.body.username,
            password : hash,
            displayName : req.body.displayName
        };

        var sql = 'INSERT INTO users SET ?';
        conn.query(sql, user, function(err, results) {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                req.login(user, function(err) {
                    req.session.save(function() {
                        res.redirect('/welcome');
                    });
                });
            }
        });
    });
});

app.get('/auth/register', function(req, res)
{
    var output = `
    <h1>REGISTER</h1>
    <form action="/auth/register" method="post">
        <p> 
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="text" name="displayName" placeholder="displayName">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;
    res.send(output);
});