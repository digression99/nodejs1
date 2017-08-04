/**
 * Created by kimilsik on 7/5/17.
 */

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

// hasher(opts, function(err, pass, salt, hash)
// {
//     // hasher 는 콜백함수를 호출한다.
//     // 이 콜백 함수를 내맘대로 바꿔서 hash값을 이용하면 된다.
//     // pass : password, salt : 우리 대신에 salt를 자동 생성해줌.
//     opts.salt = salt;
//     hasher(opts, function(err, pass, salt, hash2) {
//         assert.deepEqual(hash2, hash);
//
//         // password mismatch
//         opts.password = "aaa";
//         hasher(opts, function(err, pass, salt, hash2) {
//             assert.notDeepEqual(hash2, hash);
//             console.log("OK");
//         });
//     });
// });

// for security

var app = express();

app.listen(3004, function() {
    console.log('connected 3004 port!!!');
});

app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    secret: 'oiwehrowhvjknasd1@34124901#!@', // random value
    resave : false, // session id 를 접속할 때 마다 새로 발급하는지
    saveUninitialized : true,
    store : new fileStore() // session데이터를 저장하는 디렉토리를 만든다. 그 이름이 sessions..
}));

app.get('/auth/logout', function(req, res) {
    delete req.session.displayName; // javascript command

    res.redirect('/welcome');
});

app.get('/welcome', function(req, res) {
    if (req.session.displayName)
    {
        res.send(`
        <h1>hello, ${req.session.displayName}</h1>
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

var users = [
    {
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

app.post('/auth/login', function(req, res) {
    var uname = req.body.username;
    var pwd = req.body.password;
    var saltedPwd = '';
    var userNum = -1;

    // 오류 문장을 입력했을 경우에 대비하여야 한다.
    for (var i = 0; i < users.length; ++i)
    {
        if (users[i].username === uname)
        {
            return hasher({password:pwd, salt:users[i].salt}, // 이렇게 salt를 넘겨주면 이 salt로 hash를 만든다.
            function(err, pass, salt, hash)
            { // 콜백함수는 나중에 실행될 것이므로, hasher가 실행되는 순간에 기다려야. -> return
                if (hash === users[i].password) {
                    req.session.displayName = users[i].displayName;
                    req.session.save(function () {
                        res.redirect('/welcome');
                    })
                    // correct!
                }
            });
        }
    }
    res.send('who are you ? <p><a href="/welcome">LOGIN AGAIN</a></p>');
});

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

        req.session.displayName = user.displayName;//req.body.displayName;
        req.session.save(function(){
            res.redirect('/welcome');
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
            <input type="text" name="displayName" placeholder="displayName"
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;
    res.send(output);
});

