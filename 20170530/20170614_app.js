/**
 * Created by kimilsik on 6/14/17.
 */

// plan.
// get('topic/') : view.jade// pug.
// get('topic/id') : view.jade
// get('topic/add') : add.jade
//  post('topic/add')
//  get('topic/:id') -> redirection 해서 다시 보여준다.
// get('topic/:id/edit') :  edit.jade -> edit 기능 제공.
//  post('topic/:id/edit')
//  get('topic/:id')
// get('topic/:id/delete') : delete.jade
//  post('topic/:id/delete'); -> delete 기능도 제공.
//  get('topic/')

//
// edit -> read 와 write 동시에 되어야 한다.
//
//
//


/**
 * Created by kimilsik on 6/6/17.
 */
// lesson -> simple web app making
    // 중복의 제거, 코드의 개선

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs'); // file system
var OrientDB = require('orientjs');

var server = OrientDB({
    host : 'localhost',
    port : 2424,
    username : 'root',
    password : 'root'
});

var db = server.use('o2');

app.use(bodyParser.urlencoded({extended : false}));

app.locals.pretty = true;

app.set('views', './view_orientdb');
app.set('view engine', 'pug');

// if connected in port 3000, function is called.
app.listen(3000, function() {
    console.log('connected, 3000 port!');
})

// 라우터의 순서가 중요하다.
// add 는 액션이므로 어떤 id가 아니다
// 따라서 액션을 실행하려면 라우트를 앞부분에 두어야 한다.
app.get('/topic/add', function(req, res) {

    // if (err) {
    //     console.log(err);
    //     res.status(500).send("internal server error");
    // }

    var sql = 'SELECT FROM topic';

    db.query(sql).then(function(results) {

        // 글이 하나도 없을 때는 에러가 아니다
        // if (results.length === 0) {
        //     console.log("there is no topic record.");
        //     res.status(500).send("internal server error");
        // }

        res.render('add', {topics:results});
    })
});


// topic으로 들어온 액션을 라우팅한다.
app.post('/topic/add', function(req, res) {
    var title = req.body.title;
    var desc = req.body.description;
    var author = req.body.author;

    var sql = 'INSERT INTO topic (title, description, author) VALUES(:title, :desc, :author)';

    db.query(sql, {
        params : {
            title : title,
            desc : desc,
            author : author
        }
    }).then(function(results) {
        res.redirect('/topic/' + encodeURIComponent(results[0]['@rid']));
        //res.send(results[0]['@rid']);
    });


    // fs.writeFile('data/' + title, desc, function(err) {
    //     if (err)
    //     {
    //         console.log('filereaderror :' + err); // err 정보는 사용자에게 보내면 안된다.
    //         res.status(500).send('Internal Server Error'); // 500 -> error number. for internal use
    //     }
    //     else
    //     {
    //         // 사용자의 페이지를 옮겨버림...
    //         res.redirect('/topic/' + title);
    //         //res.send('success'); // 두번 send할 순 없다??
    //         //res.send(title + ' , ' + desc);
    //     }
    // });

});

app.get('/topic/:id/edit', function(req, res) {

    var sql = 'SELECT FROM topic';

    var id = req.params.id;

    db.query(sql).then(function(results) {
        var sql = 'SELECT FROM topic WHERE @rid=:rid';
        db.query(sql,{params: {rid : id}}).then(function(topic) {
            res.render('edit', {topics : results, top : topic[0]})
        });
        // 글이 하나도 없을 때는 에러가 아니다
        // if (results.length === 0) {
        //     console.log("there is no topic record.");
        //     res.status(500).send("internal server error");
        // }

        //res.render('edit', {topics:results});
    })
});

app.post('/topic/:id/edit', function(req, res) {

    //var sql = 'SELECT FROM topic';
    var sql = 'UPDATE topic SET title=:t, description=:d, author=:a WHERE @rid=:rid';
    // where 는 반드시 넣어야 한다. 위험하기 때문에.

    var id = req.params.id;
    var title = req.body.title;
    var desc = req.body.description;
    var author = req.body.author;

    db.query(sql, {
        params: {
            t: title,
            d: desc,
            a: author,
            rid: id
        }
    }).then(function(results) {
        res.redirect('/topic/' + encodeURIComponent(id));




        //var sql = 'SELECT FROM topic WHERE @rid=:rid';
        //db.query(sql,{params: {rid : id}}).then(function(topic) {
        //    res.render('edit', {topics : results, top : topic[0]})
        //});
        // 글이 하나도 없을 때는 에러가 아니다
        // if (results.length === 0) {
        //     console.log("there is no topic record.");
        //     res.status(500).send("internal server error");
        // }

        //res.render('edit', {topics:results});
    })
});

app.get('/topic/:id/delete', function(req, res) {

    var sql = 'SELECT FROM topic';
    var id = req.params.id;

    db.query(sql).then(function(results) {
        var sql = 'SELECT FROM topic WHERE @rid=:rid';
        db.query(sql,{params: {rid : id}}).then(function(topic) {
            res.render('delete', {topics : results, top : topic[0]})
        });
    })
});

app.post('/topic/:id/delete', function(req, res) {

    //var sql = 'SELECT FROM topic';
    //var sql = 'UPDATE topic SET title=:t, description=:d, author=:a WHERE @rid=:rid';
    var sql = 'DELETE VERTEX FROM topic WHERE @rid=:rid'; // orientdb -> delete vertex.
    // where 는 반드시 넣어야 한다. 위험하기 때문에.
    var id = req.params.id;

    db.query(sql, {
        params: {
            rid: id
        }
    }).then(function(results) {
        res.redirect('/topic/');
    })
});


app.get(['/topic', '/topic/:id'], function(req, res) {
    var sql = 'SELECT FROM topic';

    db.query(sql).then(function (results) {
        //res.send(results);
        // 이제 템플릿 파일에 전달해야.
        var id = req.params.id;

        if (id) {

            var sql = 'SELECT FROM topic WHERE @rid=:rid';
            db.query(sql,{params: {rid : id}}).then(function(topic) {
                //console.log(topic[0]);
                console.log(topic[0].title);
                console.log(topic[0].description);
                res.render('view', {topics : results, top : topic[0]})
            });

        }
        else {
            res.render('view', {topics: results})
        }

        //res.render('view', {topics:results});

    });


});


    // fs.readdir('data', function(err, files) {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).send('internal error');
    //     }
    //
    //     var id = req.params.id;
    //     if (id)
    //     {
    //         if (id === "new")
    //         {
    //             fs.readdir('data', function(err, files) {
    //                 if (err)
    //                 {
    //                     console.log(err);
    //                     res.status(500).send('Internal Server Error');
    //                 }
    //                 else
    //                 {
    //                     res.render('new', {topics : files});
    //                 }
    //             });
    //         } else {
    //             fs.readFile('data/' + id, 'utf8', function (err, data) {
    //                 if (err) {
    //                     console.log(err);
    //                     res.status(500).send('internal error');
    //                 }
    //                 else {
    //                     res.render('view', {topics: files, title: id, description: data});
    //                 }
    //             });
    //         }
    //     }
    //     else
    //     {
    //         res.render('view', {topics:files, title:'welcome', description:'hello, javascript for serverside.'});
    //     }
    //});
//});



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










