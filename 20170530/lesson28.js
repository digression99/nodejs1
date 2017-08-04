/**
 * Created by kimilsik on 6/6/17.
 */


//
// get vs post
//
// get -> 사용자가 요청하면 어떠한 정보를 가져오는 것.
// 즉 어떤 정보를 서버에 요청하여 가져오는 것.
// post -> 사용자의 정보를 서버에 전송함, 글을 서버에 전송함.


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

app.get('/form', function(req, res) {
    res.render('form');
});
// form -> url을 자동으로 생성해주는 것.
app.get('/form_receiver', function(req, res) {
    var title = req.query.title;
    var description = req.query.description;
    res.send(title + ' , ' + description);
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
