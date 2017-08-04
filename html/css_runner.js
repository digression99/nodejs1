var express = require('express');
var app = express();

var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('./views'));

app.set('views', './views');
app.set('view engine', 'pug');

app.listen(3002, function() {
    console.log('succeed in 3002!');
});

app.get('/css/:date/:id', function(req, res) {
    var id = req.params.id;
    var date = req.params.date;

    res.render('css/' + date + '_' + id);
});