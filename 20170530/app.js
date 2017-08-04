/**
 * Created by kimilsik on 6/6/17.
 */

// node.js 17
// entry or main application 이라고 부름
// 하나의 파일이 아니라 여러개의 파일로 하나의 앱을 만들게 된다.
// 그 중에서 무엇을 실행해야 앱이 동작하는가 -> 최초로 실행되는 진입점.
// app.js -> 권장하는 진입점의 이름

var express = require('express'); // 이 모듈은 사실 함수.
var app = express();

app.use(express.static('public')); // middle ware.
// public이란 디렉토리를 정적인 파일이  위치하는 곳으로 하겠다.

// app.get -> router 이다.
// 어떤 요청이 길을 찾을 수 있게 해주는 것
// request, process를 중계한다.
app.get('/', function(req, res) {
    res.send('hello home page'); // controller.
});

app.get('/login', function(req, res) {
    res.send('<h1>login please</h1>');
});

app.get('/route', function(req, res) {
    res.send('hello router, <img src="/IMG_2448.jpg">');
});


// 정적 코드 -> 굳이 다시 껐다 킬 필요 없다
// 동적 코드 -> 노드를 다시 껐다 켜야
// 왜 안되지..
app.get('/dynamic', function(req, res) {
    var lis = '';
    var time = Date();

    for (var i = 0; i < 5; i++)
    {
        lis = lis + '<li>coding</li>';
    }

    var output = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset = "utf-8">
            <title></title>
        </head>
        <body>
        <script>
            var human = {
                name : "kim",
                age : 29,
            };
            <ul>
            </ul>
            document.write("name = " + human.name + "<br>");
            document.write("age = " + human.age + "<br>");
               
        </script>
        </body>
    </html>`;
    res.send(output);
})

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




