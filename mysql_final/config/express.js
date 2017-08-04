/**
 * Created by kimilsik on 7/7/17.
 */

module.exports = function() {
    var express = require('express');
    var app = express();
    var session = require('express-session'); // 모듈
    var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
    var MySQLStore = require('express-mysql-session')(session);

// template engine
    app.set('views', './views');
    app.set('view engine', 'pug');
// template engine

    app.use(bodyParser.urlencoded({extended:false}));

    app.use(session({
        secret: 'oiwehrowhvjknasd1@34124901#!@', // random value
        resave : false, // session id 를 접속할 때 마다 새로 발급하는지
        saveUninitialized : true,
        store : new MySQLStore({ // mysql에 접속하기 위한 정보
            host :'localhost',
            port:3306,
            user:'kimilsik',
            password:'kimilsik',
            database:'o2' // 저 모듈이 자동으로 mysql에 sessions라는 테이블을 생성하고 데이터를 저장할 것이다
        })
        // 자동으로 orientdb 에 session 클래스가 생성된다.
    }));

    return app;
}