// /**
//  * Created by kimilsik on 7/1/17.
//  */
//
// lesson 77 - session
//
// 쿠키인데 좀더 개선됨
// 서버는 쿠키로 사용자의 컴퓨터에 모든 것을 저장한다.
// 이렇게 하면 보안에 문제가 생긴다
//
// 따라서 서버쪽 공간과 사용자의 공간을 조합해 활용한다
//
// 사용자가 로그인하면 사용자의 아이디만 사용자의 컴퓨터에 저장
// 즉 간단한 식별자만 사용자의 컴퓨터에 저장
// 실제 데이터는 서버쪽에 저장.
// 사용자가 사이트에 접속하면 그 식별자와 함께 요청하면
// 실제 데이터를 넘겨준다
//
// ex) set-cookie 에
// 서버가 브라우저에게 connect.sid 를 넘겨줌.
// connect.sid가 같다면 같은 사용자라고 간주한다
//
// session 로그인 예제
//
//
//
//

var express = require('express');
var session = require('express-session'); // 모듈
var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
var fileStore = require('session-file-store')(session); // file 로 session을 저장하기 위한 것

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

var userdata = {
    username : 'kimilsik',
    password : '111',
    displayName : 'Kim'
};

app.post('/auth/login', function(req, res) {
    var uname = req.body.username;
    var pwd = req.body.password;

    if (uname === userdata.username && pwd === userdata.password) {
        req.session.displayName = userdata.displayName;

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




