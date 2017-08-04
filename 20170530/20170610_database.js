var OrientDB = require('orientjs');

var server = OrientDB({
    host:       'localhost',
    port:       2424,
    username:   'root',
    password:   'root',
    useToken : true
});

var dbs = server.list().then(
        function(list){
            console.log('Databases on Server:', list.length);
        }
    );

var db = server.use({
    name:     'GratefulDeadConcerts',
    username: 'ilsik',
    password: 'ilsik'
});
//console.log(db.name)d
// db.close();
//
// server.close();
