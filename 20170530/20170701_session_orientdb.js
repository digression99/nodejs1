//
// orientdb에 저장하기 위해서는
// npm package connect-oriento가 필요.
//
//

var express = require('express');
var session = require('express-session'); // 모듈
var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
var OrientoStore = require('connect-oriento')(session);

var app = express();

app.listen(3004, function() {
    console.log('connected 3004 port!!!');
});

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

app.get('/auth/logout', function(req, res) {
    delete req.session.displayName; // javascript command

    req.session.save(function() { // orientdb에서 자동으로 지워준다??
        res.redirect('/welcome');
    });
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
        // orientdb에 저장되려면 시간이 필요한데 리다이렉션을 바로 해버리면 안된다.

        req.session.save(function() {
            res.redirect('/welcome');
        });
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




