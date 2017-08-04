
var express = require('express'); // 이 모듈은 사실 함수.
var app = express();
var bodyParser = require('body-parser'); // module

app.locals.pretty = true;

app.set('view engine', 'pug');
app.set('views', './views');


app.use(express.static('public')); // middle ware.
// public이란 디렉토리를 정적인 파일이  위치하는 곳으로 하겠다.


// 앱에서 들어오는 모든 요청들은 이 미들웨어를 통과한 다음에 라우터로 감.
app.use(bodyParser.urlencoded( {extended: false}));

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
        <a href="/topic/0">JavaScript</a><br>
        <a href="/topic/1">Nodejs</a><br>
        <a href="/topic/2">Express</a><br><br>
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

// body parser or multer 사용해야 (middleware)
// post 방식으로 전송한 데이터를 앱에서 사용할 수 있게 해주는 plugin.
app.post('/form_receiver', function(req, res) {
    var title = req.body.title;
    var desc = req.body.description;

    res.send(title + ' , ' + desc);
});

app.listen(3000, function()
{
    console.log('connected 3000 port!');
});

// lesson 31
// get, post how to use
// id, passwd를 쳤는데 get이면 url에 그게 들어가게 됨
// post -> url상에 표시되지 않음
// but 둘다 불완전... -> https 필요
// 또한, 너무 긴 정보는 get으로 전달하기에 한계.
// 온전히 전체 데이터가 전송되려면 post.


// post 방식 전송은 express가 제공하지 않기 때문에
// bodyparser를 이용해야.

// lesson 32 supervisor
// watch -> 변경되었을 시 자동 재시작되는 것.










