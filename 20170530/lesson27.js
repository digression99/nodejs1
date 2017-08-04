/**
 * Created by kimilsik on 6/6/17.
 */

//sementic web, sementic url
// 의미에 좀더 부합되는 url 체계

//non-semantic url -> ../topic?page=name
// semantic url -> /topic/name

var express = require('express'); // 이 모듈은 사실 함수.
var app = express();

app.locals.pretty = true;

app.set('view engine', 'pug');
app.set('views', './views');


app.use(express.static('public')); // middle ware.
// public이란 디렉토리를 정적인 파일이  위치하는 곳으로 하겠다.

// app.get -> router 이다.
// 어떤 요청이 길을 찾을 수 있게 해주는 것
// request, process를 중계한다.
app.get('/', function(req, res) {
    res.send('hello home page'); // controller.
});

// semantic url -> :id
app.get('/topic/:id', function(req, res) {
    var topics = [
        'javascript is ...',
        'nodejs is...',
        'express is ...'
    ];

    var output =`
        <a href="/topic?id=0">JavaScript</a><br>
        <a href="/topic?id=1">Nodejs</a><br>
        <a href="/topic?id=2">Express</a><br><br>
        ${topics[req.params.id]}
    `;
    // params -> semantic url
    // params.id 에서 id 는 위의 url과 맞춰주어야 한다.
    res.send(output); // 입력은 id property..
    // if -> .../topic?name=egoing -> name property..
});

app.get('/topic/:id/:mode', function(req, res) {
    res.send(req.params.id + ' , ' + req.params.mode);
});


app.listen(3000, function()
{
    console.log('connected 3000 port!');
});

// nodejs lesson 18
// router, controller
// router를 통해 사용자의 요청을
// 어떤 controller로 전달할지 정함

// nodejs lesson 21
// template engine
// 굉장히 편리하다.
// terminal -> supervisor app.js -> 파일이 수정되면 자동으로 알아채고 노드를 자동으로 재시작해준다.

// nodejs lesson 23
// pub express code pretty -> app.locals.pretty = true;




