/**
 * Created by kimilsik on 6/29/17.
 */
var mysql      = require('mysql');
var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'kimilsik',
    password : 'kimilsik', // in source code, there should be no important info.
    database : 'o2'
});

console.log("connection success!");
conn.connect();


// search the data.
/*
var sql = 'SELECT * FROM topic';
conn.query(sql, function(err, rows, fields) {
    if (err)
    {
        console.log(err);
    }
    else
    {
        for (var i = 0; i < rows.length; ++i)
        {
            console.log(rows[i].title);
            console.log(rows[i].author);
            console.log(rows[i].description);
        }
        //console.log('rows', rows);
        //console.log('fields', fields);
    }
});
*/

//var sql = 'insert into topic (title, description, author)' +
//   'values ("express", "web framework", "kimilsik")';


// insert
/*
var sql = 'insert into topic (title, description, author) values (?, ?, ?)';
var params = ['supervisor', 'watcher', 'graphittie'];
// sql injection!

// with no params
// conn.query(sql, function(err, rows, fields) {

// with params
conn.query(sql, params, function(err, rows, fields) {
    if (err)
    {
        console.log(err);
    }
    else
    {
        // data 를 추가하면 okpacket이 rows에 넣어져 온다
        //console.log(rows);
        console.log(rows.insertId); // 고유의 아이디를 알아낼 수 있다
    }
});
*/

// update
/*
var sql = 'update topic set title=?, author=? where id=?';

var params = ['hello', 'kimilsik', 1];

conn.query(sql, params, function(err, rows, fields) {
    if (err)
    {
        console.log(err);
    }
    else
    {
        console.log(rows);
    }
});
*/

// delete
var sql = 'delete from topic where id=?';
var params = [1];

conn.query(sql, params, function(err, rows, fields) {
    if (err)
    {
        console.log(err);
    }
    else
    {
        console.log(rows);
    }
});

//connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//    if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
//});

//connection.end();