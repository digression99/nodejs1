
//
// 먼저 mysql server 를 켠다
// -> mysql.server start
// 그 후에 mysql에 접속한다
// -> mysql -ukimilsik -p
// password : 정보입력
//
// mysql -> desc sessions;
// -> 테이블의 정보를 보여준다.
//



var express = require('express');
var session = require('express-session'); // 모듈
var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
var MySQLStore = require('express-mysql-session')(session);

var app = express();

app.listen(3004, function() {
    console.log('connected 3004 port!!!');
});

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
}));

app.get('/auth/logout', function(req, res) {
    delete req.session.displayName; // javascript command
    // 여기서 세션 정보를 지우면 자동으로 mysql 정보가 업데이트 된다.

    req.session.save(function() {
        res.redirect('/welcome');
    }); // save가 끝난 다음에 welcome 페이지로 이동하게 된다.
    // 만일 그냥 리다이렉션을 하면 로그인 정보가 반영이 안될 수가 있다.
    //res.redirect('/welcome');
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




