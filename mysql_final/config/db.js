/**
 * Created by kimilsik on 7/7/17.
 */

module.exports = function() {
    var mysql = require('mysql');

    var conn = mysql.createConnection({
        host : 'localhost',
        user : 'kimilsik',
        password : 'kimilsik',
        database : 'o2'
    });
    conn.connect();
    return conn;
}