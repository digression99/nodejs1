// /**
//  * Created by kimilsik on 7/1/17.
//  */
// lesson 70 - http
//
// 팀 버너스 리
//
// 크롬에서 네트워크 -> 어떤것이 왔다갔다 하는지 볼 수 있다
//
// option + command + i -> 도구창이 열림
//
// lesson 71 - cookie
//
// http 는 상태가 없다
// 그런데 cookie를 이용하여 사용자의 상태를 기록한다
//
// 쿠키를 기반으로 하여 세션과 인증이 나온다.
// 사용자마다 다른 상태를 유지할 수 있게 한다
//
// set-Cookie 는 약속된 표준이다
// nodejs 를 이용하여 쿠키 세팅을 명령한다
//

// express 에서는 쿠키를 기본적으로 제공하지 않으므로
//
// 쿠키를 하려면 모듈을 깔아야 한다
// cookie-parser -> npm


var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();

// 쿠키 관련 작업을 할 수 있도록 미들웨어를 쓴다
app.use(cookieParser());

app.listen(3003, function() {
    console.log('connected 3003 port!!!');
});

app.get('/count', function(req, res) {
    if (req.cookies.count)
    {
        var count = parseInt(req.cookies.count); // req.cookies.count 는 문자로 들어오므로 숫자로 만들어야.
    }
    else
    {
        var count = 0;
    }

    count++;

    res.cookie('count', count); // middleware로 인해 메소드가 생성
    res.send('count : ' + count);
    //res.send('count : ' + req.cookies.count); // 쿠키중 count를 참고.
});