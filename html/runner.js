/**
 * Created by kimilsik on 7/18/17.
 */
var express = require('express');
var app = express();
var formidable = require('formidable');
var fs = require('fs');

var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
app.use(bodyParser.urlencoded({extended:false}));

var data = {
    test1 : {title:"blabla", description:"blalsdf1"},
    test2 : {title:"blabla", description:"blalsdf2"},
    test3 : {title:"blabla", description:"blalsdf3"},
    test4 : {title:"blabla", description:"blalsdf4"}
};

app.set('views', './views');
app.set('view engine', 'pug');

app.listen(3000, function() {
    console.log('succeed in 3000!');
});

app.get(['/main', '/main/:num'], function(req, res) {
    var num = req.params.num;

    if (num) {
        res.render('main', {dat : data["test" + num]});
    } else {
        res.render('main');
    }
});

app.get('/input', function(req, res) {
    res.render('20170718_input');
});

app.get('/imgtest', function(req, res) {
    res.render('imageload');
});

app.post('/upload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filename.path;
        var newpath = './files/' + files.filename.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
        });
    });
});

app.get('/newform', function(req, res) {
    res.render('20170718_newform');
});

app.get('/upload', function(req, res) {
    res.render('20170718_upload');
});

app.get('/meta', function(req, res) {
    res.render('20170718_meta');
});