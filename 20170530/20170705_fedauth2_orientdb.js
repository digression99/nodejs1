/**
 * Created by kimilsik on 7/5/17.
 */
/*

lesson 104 - orientdb로 사용자 정보 저장하기

orientdb는 OUser라는 클래스가 미리 있는데, 이를 이용하여
사용자 정보를 저장할 수 있는 자체 클래스가 있다.


 */

////////////////////////////////////////////////

//
// var users = [
//     {
//         //id : 1,
//         authId : 'local:kimilsik',
//         username : 'kimilsik',
//         salt : '8MCJ7P5qiuzs/JlpC/de55fB9SLRgLQdavZ0sciRkAuJDcwCmy1PR95CIqeZXKeHk4XtsyolrFgMcdgWg2UgZA==',
//         //password : '55bdaf488171cc19b5c67435e6a17c90',// 평문으로 암호가 저장. 암호를 암호화한다. -> terminal 에서 알아냄.
//         password : '9gyeresaK/nQ//2OnCYMahZ433dNlUSVrYR5Uh1IDkXVcpGJGD35w9P58VOPtHjGwpgCX1sZf4riJH4gR24hKsV+bYNNx8gwEL+/4Sk5J/udCfZ5p3Dmzenisffz1I8IUP2lXNWxsvfJHmO3oXczPhjWuQm7WnyXelCOEWN0ao0=',
//         displayName :'kimilsik'
//     },
//     // {
//     //     username : 'nasuk',
//     //     salt : '1231DFSF%#$#',
//     //     //password : 'ac536f34dc51048d8be54dd1425f2e57',
//     //     password : 'fe3b51034c66598c45cbd1463924a3afc4f1bf47c3f520c75ae9bf346d36114f',
//     //     displayName : 'nasuk'
//     // }
// ];
// data

var express = require('express');
var app = express();
var session = require('express-session'); // 모듈
var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
//var fileStore = require('session-file-store')(session); // file 로 session을 저장하기 위한 것
//var fs = require('fs');
var OrientoStore = require('connect-oriento')(session);
var OrientDB = require('orientjs');

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

var server = OrientDB({
    host : 'localhost',
    port : 2424,
    username : 'root',
    password : 'root'
});
var db = server.use('o2');

// for database




app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    secret: 'oiwehrowhvjknasd1@34124901#!@', // random value
    resave : false, // session id 를 접속할 때 마다 새로 발급하는지
    saveUninitialized : true,
    store : new OrientoStore({
        server : 'host=localhost&port=2424&username=root&password=root&db=o2'
    })
    // 자동으로 orientdb 에 session 클래스가 생성된다.
}));

// app.use(session({
//     secret: 'oiwehrowhvjknasd1@34124901#!@', // random value
//     resave : true, // session id 를 접속할 때 마다 새로 발급하는지
//     saveUninitialized : false,
//     store : new fileStore(), // session데이터를 저장하는 디렉토리를 만든다. 그 이름이 sessions..
//     //cookie : {
//     //    secure : false,
//     //}
// }));

// federation authentication
app.use(passport.initialize());
app.use(passport.session());

app.listen(3004, function() {
    console.log('connected 3004 port!!!');
});

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

app.get('/auth/facebook', passport.authenticate(
    'facebook',
    {
        scope : 'email'
    }
));

app.get('/auth/facebook/callback', passport.authenticate('facebook',
    {
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