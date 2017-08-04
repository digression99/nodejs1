/**
 * Created by kimilsik on 7/11/17.
 */

/*

 lesson 104 - orientdb로 사용자 정보 저장하기

 orientdb는 OUser라는 클래스가 미리 있는데, 이를 이용하여
 사용자 정보를 저장할 수 있는 자체 클래스가 있다.
 */

var app = require('./config/express')();

app.listen(3004, function() {
    console.log('connected 3004 port!!!');
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