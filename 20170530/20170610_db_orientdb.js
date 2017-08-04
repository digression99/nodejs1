/**
 * Created by kimilsik on 6/10/17.
 */
//
// leeson 41 database
// 관계형 데이터베이스 -> oracle, mysql, ...
// sql 언어 -> 관계형 데이터베이스에서 사용. -> so important...
//
// NoSQL -> not only sql -> 다양한 형태의 디비 출현하는 운동...
// 과거에 비해 훨씬 다루기 쉬워진 디비.
// backup, hardware robustness etc...
// db의 본질적인 기능인 데이터를 넣고 빼는 효율성에 집중할 수 있게 됨
//
//
// orientdb로 웹앱 만들기 39 ~ 53
// graph database -> 정보와 정보 사이의 연결성 관계(relational database...)
// graph database가 관계성을 훨씬 더 잘 처리할 수 있다.
//
// document database -> consider a database as a document. saving the document.
// -> more fluent flow of the data.
//
// object-oriented concept -> 글 이란 테이블 -> 댓글 포스트 등 부모자식 관계를 통한 데이터 구조를 가질 수 있는 유연함.
// table 대신 class.
//
// schema-less -> 구조 즉 테이블을 만들거나 만들지 않거나 자유.
// 사용자 인증체계 -> 행 단위로 사용자를 구분.
// 일반 -> 어떤 사용자는 어떤 테이블에 대하여 권한. -> 테이블에 있는 모든 정보를 활용.
// 행단위 security level -> 하나의 테이블 안에서 여러 사용자가 동일한 글 -> 글 쓰는 사람마다 글에 대한 권한만 가질 수 있게 함.
// => 사용자 인증을 데이터베이스에 위임.
//
// orientdb -> sql도 제공.
//
// acid transaction
//
// relationship traversing -> table 과 table의 연결성 -> 원래는 join으로 테이블이 하나인 것처럼 보이게.
// orientdb -> 데이터가 아무리 많아도 관계성을 가지는 데이터 조회 시간은 일정하게 유지.
//
// multimaster replication ->
// 여러개의 쓰기 작업을 처리하는 데이터베이스를 둘 수 있다
//
// shading -> 데이터 처리량이 많아지면서 어떻게 데이터를 분산하는가
//
// restful한 api제공 -> middleware(php, java 등) 없이 직접 접근해서 조종.
//
// ------------
// orientdb 사용 -> 접속 : localhost:2480
//
// class making -> vertex
// properties -> 관계형의 column
// --> schema...
// 구조가 없다 -> 어떤 행에는 title 있고 어떤 행에는 title 없다.. -> schema mix, schema less ...
//
// GratefulDeadConcepts -> sample
//
// CREATE
// READ     -> CRUD
// UPDATE
// DELETE
    // 기초 작업을 crud라 한다.
// crud 하는 방법
//
var OrientDB = require('orientjs');

var server = OrientDB({
    host:     'localhost',
    port:     2424,
    username: 'root',
    password: 'root',
    //servers:  [{host: 'localhost', port: 2424}]
});

var db = server.use('GratefulDeadConcerts');


var sql = 'SELECT FROM V';
db.query(sql).then(function(results) {
    console.log(results);
});

// var db = server.use({
//     name:     'GratefulDeadConcerts',
//     username: 'ilsik',
//     password: 'ilsik'
// });

// db.record.get('#9:2').then(function(results) {
//     console.log(results.title);
// });

//db.close();
//server.close();


//
// var server = OrientDB({
//     host: 'localhost',
//     port: 2424, // orientDB -> normally use 2424
//     username: 'root',
//     password: 'root',
//     useToken : true
// });


// var dbs = server.list()
//     .then(
//         function(list){
//             console.log('Databases on Server:', list.length);
//         }
//     );


// var db = server.use('o2');

// var sql2 = 'SELECT FROM topic WHERE @rid=rid';
// // param 이란 class 안에 params라는 property존재.
// var param = {
//     params : {
//         rid : '#21:0'
//     }
// }
// db.query(sql2, param).then(function(results) {
//     console.log(results);
// });



//if (server.exists)

// var db = server.use( {
//     name : 'o2',
//     username : 'root',
//     password : 'root'
//     });

// var rec = db.record.get('#21:0');
// console.log(rec.title);
//
// var rec2 = db.record.get('#22:0');
// console.log(rec2.title);

// db.record.get('#21:0').then(function(record) {
//     console.log('data :', record.title);
// });
//
// db.close();


//var db = server.use('o2_learning');
//console.log('using database: ' + db.name);



// record -> 하나의 행.

// get의 번호 -> topic 의 data의 @rid. -> 식별자.

//var rec = db.record.get('#23:0');
//console.log(rec.title);

// db.record.get('#22:0').then(function (record) {
//     console.log('loaded record : ', record);
// })


////////// CREATE

//var sql = 'SELECT * FROM topic';
//db.query(sql).then(function(results) {
//    console.log(results);
//});



////////// READ


////////// UPDATE


////////// DELETE









































