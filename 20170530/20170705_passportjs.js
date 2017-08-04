/**
 * Created by kimilsik on 7/5/17.
 */

/*

오늘날에는 인증 방법이 여러가지가 있다
페이스북, 구글 등에서 인증할 수 있기 때문이다
따라서 passportjs 를 이용하여 다양한 인증 방법을 이용할 수 있다.
-> federation authentication ( 타사 인증 방법 )
- facbook, naver, kakao, google, local, ...

passportjs -> 여러 인증 방법을 통합함.
절차가 길다.

passport-local -> 내 서버에서 자체적인 아이디, 패스워드를 이용한 로그인 전략.
passport-local에서 form 양식은 꼭 지켜줘야 한다.
특히, username, password 등을 이렇게 이름으로 지정하지 않으면 못찾는다.

passport 에 위임한다..

-------------------

session 을 이용하려면 serializerUser, deserializerUser 를 사용.
근데 id가 필요하다 -> 식별자.
==> 여기에서는 username을 식별자로 사용한다.


-------------------

2017.07.05 - deserializeUser 가 호출되지 않는 경우가 발생했다.
해결 -> 함수의 순서를 바꿔주고, app.use를 앞부분에 두니 해결.


 */

// data
var users = [
    {
        //id : 1,
        username : 'kimilsik',
        salt : '8MCJ7P5qiuzs/JlpC/de55fB9SLRgLQdavZ0sciRkAuJDcwCmy1PR95CIqeZXKeHk4XtsyolrFgMcdgWg2UgZA==',
        //password : '55bdaf488171cc19b5c67435e6a17c90',// 평문으로 암호가 저장. 암호를 암호화한다. -> terminal 에서 알아냄.
        password : '9gyeresaK/nQ//2OnCYMahZ433dNlUSVrYR5Uh1IDkXVcpGJGD35w9P58VOPtHjGwpgCX1sZf4riJH4gR24hKsV+bYNNx8gwEL+/4Sk5J/udCfZ5p3Dmzenisffz1I8IUP2lXNWxsvfJHmO3oXczPhjWuQm7WnyXelCOEWN0ao0=',
        displayName :'kimilsik'
    },
    // {
    //     username : 'nasuk',
    //     salt : '1231DFSF%#$#',
    //     //password : 'ac536f34dc51048d8be54dd1425f2e57',
    //     password : 'fe3b51034c66598c45cbd1463924a3afc4f1bf47c3f520c75ae9bf346d36114f',
    //     displayName : 'nasuk'
    // }
];
// data

var express = require('express');
var session = require('express-session'); // 모듈
var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
var fileStore = require('session-file-store')(session); // file 로 session을 저장하기 위한 것

// for security
var bkfd2Password = require("pbkdf2-password");
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

// federation authentication

var app = express();

app.listen(3004, function() {
    console.log('connected 3004 port!!!');
});

app.use(session({
    secret: 'oiwehrowhvjknasd1@34124901#!@', // random value
    resave : false, // session id 를 접속할 때 마다 새로 발급하는지
    saveUninitialized : true,
    store : new fileStore(), // session데이터를 저장하는 디렉토리를 만든다. 그 이름이 sessions..
    //cookie : {
    //    secure : false,
    //}
}));

app.use(bodyParser.urlencoded({extended:false}));

// federation authentication

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.username); // passport.use 에서 done이 호출될 때 자동으로 호출된다.
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);

    for (var i = 0; i < users.length; ++i)
    {
        if (users[i].username === id)
        {
            return done(null, users[i]);
        }
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        for (var i = 0; i < users.length; ++i)
        {
            if (users[i].username === username)
            {
                return hasher({password : password, salt : users[i].salt},
                function(err, pass, salt, hash) {
                    if (hash === users[i].password) {
                        console.log('localstrategy', users[i]);

                        done(null, users[i]); // login succeed.
                        // 만일 flash를 쓴다면, 세번째 인자로 message를 보내면 그 메시지가 보여진다.
                        // null -> error 를 첫 번째 인자로.
                    }
                    else
                    {
                        done(null, false);
                    }
                });
            }
        }
        done(null, false); // login failure.
    }
));

// federation authentication

app.get('/auth/logout', function(req, res) {
    req.logout(); // request 의 logout method 를 호출한다.
    //delete req.session.displayName; // javascript command
    req.session.save(function()
    {
        res.redirect('/welcome');
    });
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
    `;
    res.send(output);
});

app.post('/auth/register', function(req, res) {
    hasher({password:req.body.password}, function(err, pass, salt, hash) {
        var user = {
            salt : salt,
            username : req.body.username,
            password : hash,
            displayName : req.body.displayName
        };

        users.push(user);

        // passport 가 넣어주는 함수 -> login()
        req.login(user, function(err) {
            req.session.save(function() {
                res.redirect('/welcome');
            });
        });
    });
});

app.get('/auth/register', function(req, res) {
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

