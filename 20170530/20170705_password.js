/**
 * Created by kimilsik on 7/5/17.
 */

/*
lesson 87 - password

사용자의 비밀번호는 결코 유출되지 않아야 한다...

현재까지 만든 앱에서는 사용자의 비밀번호가 데이터베이스에 있다.
그 보안시스템은 언제나 뚫릴 가능성을 가지고 있다.

따라서 비밀번호를 암호화하여 비밀번호를 알 수 없게 하면서 로그인 할 수 있는 방법은?

암호화하기 위해 지켜야 할 게 몇 가지 있다.

암호화를 하는 이유와 방법정도만 이해하고 원리는 나중에 이해해도 된다.

md5 -> npm install md5



*/

// var md5 = require('md5');
//
// console.log('javascript');
//
// console.log(md5('javascript'));
// javascript -> can be changed to de9...
// but can't change reversed way
// -> 단방향 암호화
// 복호화는 불가능
// 과거에는 사용했으나 현재는 사용 안함.

/*

md5 를 이용하려면
사용자가 회원가입을 할 때 한번 입력받아서
아예 데이터베이스에 md5 변환을 한 상태로 저장하는 것이다.

그리고 로그인 할 때, 입력받은 것을 md5로 변환해서 매칭을 비교하면 된다.
but, crackstation.net 에서 이걸 깰 수 있다..

이를 예방하기 위해서는 salt 값을 이용한다.

var salt = '!@#*&^%$%^$#@$!@fklsdjfoweqs132131';

var pwd = '111';

md5(pwd + salt);

이 값을 실제 데이터베이스에 저장한다.
salt를 여러 겹 둬서 보안을 더 어렵게 만들 수도..

but, 어떤 유저 두 명의 비밀번호가 같다면, 이 값은 같게 된다.
클라우드를 이용한 엄청난 컴퓨팅 파워로 보안을 뚫게 된다면,
하나의 해싱값을 뚫어서 같은 해싱값을 가진 다른 비밀번호를 다 뚫게 된다.
사용자마다 다른 salt를 적용할 수 있다.

md5 는 더이상 사용하지 않는다. 설계상의 결함들이 있기 때문.

-----------------

현재는 sha256, sha512 등을 쓴다.

-> npm install sha256 --save



 */


var express = require('express');
var session = require('express-session'); // 모듈
var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
var fileStore = require('session-file-store')(session); // file 로 session을 저장하기 위한 것
var md5 = require('md5');

var salt = '!@#*&^%$%^$#@$!@fklsdjfoweqs132131'; // for md5
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
        `);
    }
});

var users = [
    {
        username : 'kimilsik',
        salt : '!@#!@kjfds',
        password : '55bdaf488171cc19b5c67435e6a17c90',// 평문으로 암호가 저장. 암호를 암호화한다. -> terminal 에서 알아냄.
        displayName :'kimilsik'
    },
    {
        username : 'nasuk',
        salt : '1231DFSF%#$#',
        password : 'ac536f34dc51048d8be54dd1425f2e57',
        displayName : 'nasuk'
    }
];

app.post('/auth/login', function(req, res) {
    var uname = req.body.username;
    var pwd = req.body.password;
    var saltedPwd = '';
    var userNum = 0;

    // 오류 문장을 입력했을 경우에 대비하여야 한다.
    for (var i = 0; i < users.length; ++i)
    {
        if (users[i].username === uname)
        {
            saltedPwd = md5(pwd + users[i].salt);
            userNum = i;
            break;
        }
    }

    if (uname === users[userNum].username && saltedPwd === users[userNum].password) {
        req.session.displayName = users[userNum].displayName;
        // 사용자가 입력한 비밀번호를 어디에도 저장하지 않고 앱을 끝내기 때문에
        // 보안상으로 더 안전하다.

        res.redirect('/welcome');
    }
    else
    {
        res.send('who are you ? <p><a href="/auth/login">LOGIN AGAIN</a></p>');
    }
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





