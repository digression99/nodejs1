/**
 * Created by kimilsik on 6/14/17.
 */

/*

Lesson 44
CREATE, READ, UPDATE, DELETE -> CRUD

 */


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



var OrientDB = require('orientjs');

var server = OrientDB({
    host : 'localhost',
    port : 2424,
    username : 'root',
    password : 'root'
});

var db = server.use('o2');

// CREATE

// var sql = 'SELECT FROM topic';
// //var sql = 'SELECT FROM topic WHERE @rid=:rid'; // rid 는 param과 이름이 매칭되어야 한다.
// // 바뀔 수 있는 부분이 콜론으로.
//
// db.query(sql).then(function(results) {
//     console.log(results);
// });

// var param = {
//     params : {
//         rid : '#21:0'
//     }
// };
//
// db.query(sql, param).then(function(results) { // what is promise? what is then function?
//     console.log(results);
// });

// INSERT
// desc 는 문제. description 으로 해야 됨.
//
// var sql = 'INSERT INTO topic2 (title, description) VALUES(:title, :descr)';
//
// db.query(sql, {
//     params: {
//         title : 'express',
//         descr : 'express is framework for web'
//     }
// }).then(function(results) {
//     console.log(results);
// });

// UPDATE

// var sql = "UPDATE topic SET title=:title WHERE @rid=:rid";
// db.query(sql, {params :
//     { title : "expressjs", // title 을 expressjs로 수정한다.
//     rid : "21:0"}
// }).then(function(results) {
//     console.log(results); // result -> 1. 몇개의 행이 수정되었는지를 보여준다.
// });

// DELETE
// generic class로 만들어야 한다
// generic class 가 아니라 vertex class 면 각각의 row들은 vertex로
// DELETE VERTEX 로 지워야 한다.
var sql = "DELETE FROM topic2 WHERE @rid=:rid";
db.query(sql, {
    params : {
        rid : '#25:0'
    }
}).then(function(results) {
    console.log(results);
});



// var param = {
//     params : {
//         title : 'Express',
//         desc : 'express is framework for web'
//     }
// };
//
// db.query(sql, param).then(function(results) {
//     console.log(results);
// });

// db.record.get('#21:0').then(function(results) {
//     console.log('loaded data : ', results);
// });












// 서버는 모든 일을 끝낸 뒤에 특정한 동작 시 닫히도록 한다
// 그냥 닫으면 안닫힌다.
//server.close();