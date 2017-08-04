/**
 * Created by kimilsik on 7/11/17.
 */

module.exports = function () {
    var OrientDB = require('orientjs');
    var server = OrientDB({
        host : 'localhost',
        port : 2424,
        username : 'root',
        password : 'root'
    });
    return server.use('o2');
};