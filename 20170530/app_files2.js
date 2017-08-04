/**
 * Created by kimilsik on 6/6/17.
 */
// lesson -> simple web app making
    // 중복의 제거, 코드의 개선

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs'); // file system


app.use(bodyParser.urlencoded({extended : false}));

app.locals.pretty = true;

app.set('views', './views_file');
app.set('view engine', 'pug');

// if connected in port 3000, function is called.
app.listen(3000, function() {
    console.log('connected, 3000 port!');
})

app.get('/topic/new', function(req, res) {
    fs.readdir('data', function(err, files) {
        if (err)
        {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else
        {
            res.render('new', {topics : files});
        }
    });
    //res.render('new');
});

app.get(['/topic', '/topic/:id'], function(req, res) {
    fs.readdir('data', function(err, files) {
        if (err) {
            console.log(err);
            res.status(500).send('internal error');
        }

        var id = req.params.id;
        if (id)
        {
            if (id === "new")
            {
                fs.readdir('data', function(err, files) {
                    if (err)
                    {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    }
                    else
                    {
                        res.render('new', {topics : files});
                    }
                });
            } else {
                fs.readFile('data/' + id, 'utf8', function (err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).send('internal error');
                    }
                    else {
                        res.render('view', {topics: files, title: id, description: data});
                    }
                });
            }
        }
        else
        {
            res.render('view', {topics:files, title:'welcome', description:'hello, javascript for serverside.'});
        }
    });
});



// app.get('/topic', function(req, res) {
//     fs.readdir('data', function(err, files) {
//         if (err) {
//             console.log('fileReadErr : ' + err);
//             res.status(500).send('internal error');
//         }
//         else
//         {
//             res.render('view', {topics:files});
//         }
//     });
//     //res.render('view');
// });
//
// app.get('/topic/:id', function(req, res) {
//     var id = req.params.id;
//
//     fs.readdir('data', function(err, files) {
//         if (err) {
//             console.log('fileReadErr : ' + err);
//             res.status(500).send('internal error');
//         }
//         fs.readFile('data/' + id, 'utf8', function(err, data) {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send('internal error');
//             }
//             else
//             {
//                 res.render('view', {topics:files, title:id, description:data});
//                 //res.send(data);
//             }
//         });
//     });
// });

// topic으로 들어온 액션을 라우팅한다.
app.post('/topic', function(req, res) {
    var title = req.body.title;
    var desc = req.body.description;

    fs.writeFile('data/' + title, desc, function(err) {
        if (err)
        {
            console.log('filereaderror :' + err); // err 정보는 사용자에게 보내면 안된다.
            res.status(500).send('Internal Server Error'); // 500 -> error number. for internal use
        }
        else
        {
            // 사용자의 페이지를 옮겨버림...
            res.redirect('/topic/' + title);
            //res.send('success'); // 두번 send할 순 없다??
            //res.send(title + ' , ' + desc);
        }
    });

});










