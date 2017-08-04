/**
 * Created by kimilsik on 7/11/17.
 */

// /table/*

/*

지울때 -> rid는 지울때나 업데이트할 때, 선택할 때 쓰인다. url에 나타나게 한다.
 */

module.exports = function (db) {
    var router = require('express').Router();

    router.get('/add', function(req, res) {
        return res.render('shoppingcart/table/add');
    });

    router.post('/add', function(req, res) {
        // basic data info.
        var title = req.body.title;
        var desc = req.body.description;
        var authId = req.user.authId;
        var displayName = req.user.displayName;

        // board number
        var boardNum = 1;

        // time info.
        var date = new Date();

        var year = date.getFullYear();
        var mon = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        // time info.

        var sql = 'insert into contents (' +
            'title, ' +
            'description, ' +
            'authId, ' +
            'displayName, ' +
            'boardNum, ' +
            'date_year, ' +
            'date_mon, ' +
            'date_day, ' +
            'date_hour, ' +
            'date_min, ' +
            'date_sec ' +
            ') values ' +
            '(:title, ' +
            ':description, ' +
            ':authId, ' +
            ':displayName, ' +
            ':boardNum, ' +
            ':date_year, ' +
            ':date_mon, ' +
            ':date_day, ' +
            ':date_hour, ' +
            ':date_min, ' +
            ':date_sec)';

        db.query(sql, {params: {
            title : title,
            description : desc,
            authId : authId,
            displayName : displayName,
            boardNum : boardNum,
            date_year : year,
            date_mon : mon,
            date_day : day,
            date_hour : hour,
            date_min : min,
            date_sec : sec
        }}).then(function(results) {
            console.log(results);
            req.session.save(function () {
                res.redirect('/shoppingcart/table/main');
            });
        });
    });

    router.post('/:rid/edit', function(req, res) {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        var sql = 'update contents set title=:title, ' +
            'description=:description, ' +
            'date_hour=:hour, ' +
            'date_min=:min, ' +
            'date_sec=:sec ' +
            'where @rid=:rid';
        var rid = decodeURIComponent(req.params.rid);

        db.query(sql, {params: {
            title : req.body.title,
            description : req.body.description,
            hour : hour,
            min : min,
            sec : sec,
            rid : rid
        }}).then(function(results) {
            if (results === 0) {
                console.log(err);
                res.status(500).send('internal server error');
            } else {
                console.log('edit succeed!');
                res.redirect('/shoppingcart/table/' + encodeURIComponent(rid) + '/');
            }
        });
    });

    router.get('/:rid/edit', function(req, res) {
        // 여기서 폼을 만들어서 다시 제출하게 해야 한다..
        var rid = req.params.rid;
        var sql = 'select from contents where @rid=:rid';
        var userid = req.user.authId;
        db.query(sql, {params: {
            rid:decodeURIComponent(rid)
        }}).then(function(results) {
            if (results === 0)
            {
                res.status(500).send('internal server error');
            }
            else
            {
                if (userid !== results[0].authId)
                {
                    res.render('shoppingcart/table/error_message_page', {message : "you can't do that."});
                }
                else
                {
                    res.render('shoppingcart/table/update_page', {
                        rid : encodeURIComponent(rid),
                        title : results[0].title,
                        cont:results[0].description});
                }
            }
        });
    });

    router.post('/:rid/delete', function(req, res) {
        // 이렇게 되면 authId가 같은 모든 글이 다 지워진다.
        // 이 글을 특정하려면 rid가 필요하다.
        var rid = req.params.rid;
        var sql = 'delete vertex from contents where @rid=:rid';

        db.query(sql, {params: {
        rid : decodeURIComponent(rid)
        }}).then(function (results) {
            console.log(results);

            var sql = 'select from contents';

            db.query(sql, {params:{}}).then(function(results) {
                res.render('shoppingcart/table/main', {contents:results, message:'delete success!'})
            });
        });
    });

    router.get('/:rid/delete', function(req, res) {
        var rid = req.params.rid;
        var userid = req.user.authId;

        var sql = 'select from contents where @rid=:rid';

        db.query(sql, {params : {
            rid : decodeURIComponent(rid)
        }}).then(function(results) {
           console.log(results);

           if (results.length === 0)
           {
               res.status(500);
           }
           else
           {
               if (userid != results[0].authId)
               {
                   res.render('shoppingcart/table/error_message_page', {message : "you can't do that."});
               }
               else
               {
                   res.render('shoppingcart/table/delete_confirm', {rid:encodeURIComponent(rid)})
               }
           }
        });
    });

    router.get(['/main', '/:id'], function(req, res) {
        // the writings is saved with authId, so I can find the data
        // by using the authId inside the writing objects.
        //var sql = 'select from contents';// where authid=:authId';
        var sql = 'select from contents';//where authId=:authId';
        //var temp = 1231;
        // 디비가 바뀌는 걸까? 아니면 왜 authId를 못찾는거지?
        // authid 에서 i가 소문자였다... ㅅㅂ새끼야

        db.query(sql, {params:{
            authId : req.user.authId
        }}).then(function(results) {
            if (results.length === 0)
            {
                console.log('no content!');
                res.render('shoppingcart/table/nocontent', {displayName : req.user.displayName});
            }
            else
            {
                var id = req.params.id;

                if (id)
                {
                    console.log(' id ! : ' + id);
                    // id 는 rid이다.
                    var sql = 'select * from contents where @rid=:id';

                    db.query(sql, {params:{id:id}}).then(function(dat) {
                        console.log(dat);
                        res.render('shoppingcart/table/datas', {
                            contents:results,
                            data:dat[0],
                            aid:encodeURIComponent(dat[0].authId),
                            displayName:req.user.displayName});
                    });
                }
                else
                {
                    console.log('no id!');
                    // extends 했기 때문에 이거를 렌더해야 한다.
                    res.render('shoppingcart/table/datas', {contents:results});
                }
            }
        });
    });

    return router;
};