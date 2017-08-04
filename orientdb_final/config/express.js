/**
 * Created by kimilsik on 7/11/17.
 */

module.exports = function() {
    var express = require('express');
    var app = express();
    var session = require('express-session'); // 모듈
    var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
    var OrientoStore = require('connect-oriento')(session);
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(session({
        secret: 'oiwehrowhvjknasd1@34124901#!@', // random value
        resave : false, // session id 를 접속할 때 마다 새로 발급하는지
        saveUninitialized : true,
        store : new OrientoStore({
            server : 'host=localhost&port=2424&username=root&password=root&db=o2'
        })
        // 자동으로 orientdb 에 session 클래스가 생성된다.
    }));

    app.set('views', './views');
    app.set('view engine', 'pug');

    var passport = require('./config/passport')(app);
    var auth = require('./routes/auth')(passport);
    app.use('/auth', auth);
    var db = require('./config/db')();

    return app;
};
