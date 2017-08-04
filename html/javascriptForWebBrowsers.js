/**
 * Created by kimilsik on 7/24/17.
 */

/**
 * Created by kimilsik on 7/24/17.
 */


//
// https://expressjs.com/en/starter/static-files.html
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var express = require('express');
var app = express();
var formidable = require('formidable');
var fs = require('fs');

var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('./views'));

app.set('views', './views');
app.set('view engine', 'pug');

app.listen(3002, function() {
    console.log('succeed in 3002!');
});

//var src1 = require('./views/jwb/20170724_script');
// jquery 방식의 ajax통신
// app.post('/jwb/ajax1', function(req, res) {
//     console.log('POST 방식으로 서버 호출됨');
//     var msg = req.body.msg;
//     msg = '[에코]' + msg;
//     res.send({result:true, msg:msg});
// });

app.get('/jwb/youtube', function(req, res) {
    res.render('jwb/20170801_5');
});

app.post('/jwb/youtube', function(req, res) {
    console.log('youtube tottime...');
});

app.get('/jwb/ajax2', function(req, res) {
    res.render('jwb/20170801_4');
});

app.post('/jwb/ajax2', function(req, res) {
   console.log('ajax2 executed...');
   console.log('req.body is : ');
   console.log(req.body);


   var date = new Date();
   var time = date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDay();

   if (req.body.format === 'y-m-d h:i:s')
       time += ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();

   res.send(time);
});

app.get('/jwb/:date/:id', function(req, res) {
    var id = req.params.id;
    var date = req.params.date;

    res.render('jwb/' + date + '_' + id);
});

app.get(['/jwb', '/'], function(req, res) {
    var num = req.params.num;

    if (num) {
        res.render('main', {dat : data["test" + num]});
    } else {
        res.render('main');
    }
});