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

// 쿠키로 사용자의 웹 브라우저에 CRUD 하는 것이다
//
// lesson 76 - cookie & security
//
// 로그인과 관련된 쿠키는 굉장히 보안상 중요
// 컴퓨터에 박혀있으므로 누군가가 쿠키를 읽으면 위험하다
// 따라서 https 방법으로 통신을 해야 한다
// 그리고 쿠키값 자체를 암호화해야 한다
// cookieParser에 아무렇게나 입력한 값을 키값으로 사용한다
//
//
//
//
//


var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();

// 쿠키 관련 작업을 할 수 있도록 미들웨어를 쓴다
app.use(cookieParser('iwhgruibasdviu2893ruwdfs')); // 암호화 -> key

app.listen(3003, function() {
    console.log('connected 3003 port!!!');
});

var products = {
    1 : { title : 'the history of web 1'},
    2 : { title : 'the next web'}
}; // 객체를 만들고 이것을 데이터베이스 대용으로 한다

app.get('/products', function(req, res)
{
    var output = '';

    for (var name in products)
    {
        // ` -> backtick, template string
        // ${ ? } -> 이 안에서 변수를 넣으면 사용 가능하다
        //  이 변수는 문자열로 변환된다(toString)
        // 템플릿 문자열은 여러 줄에 걸쳐서 작성 가능, 모두 포함됨.
        output += `<li>
                    <a href="/cart/${name}">${products[name].title}</a>
                   </li>`;


        //console.log(name); -> 1, 2가 구해짐
        console.log(products[name].title);
    }
    // 여기서는 html body등의 태그가 없는데, 이것은 안좋은 것이다

    res.send(`
        <h1>Products</h1>
        <ul>${output}</ul>
        <a href="/cart">Cart</a>`);
    //res.send('products');
});

app.get('/cart/:id', function(req, res) {
    var id = req.params.id;

    //if (req.cookies.cart) // cart가 이미 심어져 있었다면
    if (req.signedCookies.cart)
    {
        var cart = req.signedCookies.cart;
        //var cart = req.cookies.cart;
    }
    else
    {
        var cart = {}; // 사용자의 웹브라우저에 심을 객체 (쿠키로)
    }

    if (!cart[id]) cart[id] = 0;

    cart[id] = parseInt(cart[id]) + 1;

    res.cookie('cart', cart, {signed:true});
    console.log(cart);
    res.redirect('/cart');
    //res.send(cart);
});

app.get('/cart', function(req, res) {
    var cart = req.signedCookies.cart;
    //var cart = req.cookies.cart;

    if (!cart)
    {
        res.send('empty!');
    }
    else
    {
        var output = '';
        for (var id in cart)
        {
            output += `<li>${products[id].title} : (${cart[id]})</li>`;
        }
    }

    res.send(`
            <h1>Cart</h1>
            <ul>${output}</ul>
            <a href="/products">Products Lists</a>`);
    //res.send('hi, cart');
    // 삭제 기능을 구현해보자.
})

app.get('/count', function(req, res) {

    //if (req.cookies.count)
    if (req.signedCookies.count)
    {
        var count = parseInt(req.signedCookies.count);
       // var count = parseInt(req.cookies.count); // req.cookies.count 는 문자로 들어오므로 숫자로 만들어야.
    }
    else
    {
        var count = 0;
    }

    count++;

    res.cookie('count', count, {signed:true}); // cookie를 암호화
    //res.cookie('count', count); // middleware로 인해 메소드가 생성
    res.send('count : ' + count);
    //res.send('count : ' + req.cookies.count); // 쿠키중 count를 참고.
});