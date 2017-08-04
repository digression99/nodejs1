/**
 * Created by kimilsik on 7/5/17.
 */

/*

개정 1 -> 사용자 정보를 파일로 저장한다. / 구현

개정 2 -> 사용자 정보를 디비로 저장한다.

개정 3 -> 내부 인증 체계는 없애고, authId만 디비에 저장하여 보안을 높여본다.


개정 4 -> oauth 등 token을 사용한 보안 체계를 적용해본다.


개정 5 -> 서비스를 올려본다...
 */

/*

개정 1

-20170706 일단 레지스터로 파일 저장하는 것을 구현해보자. local strategy
- error -> fs.readdir there is no directory -> directory vs file!
==> fs.readfile로 해결


the id and password of database is inserted in environment
when we try to start the server.

 */


////////////////////////////////////////////////


var users = [
    {
        //id : 1,
        authId : 'local_kimilsik',
        username : 'kimilsik',
        salt : '8MCJ7P5qiuzs/JlpC/de55fB9SLRgLQdavZ0sciRkAuJDcwCmy1PR95CIqeZXKeHk4XtsyolrFgMcdgWg2UgZA==',
        //password : '55bdaf488171cc19b5c67435e6a17c90',// 평문으로 암호가 저장. 암호를 암호화한다. -> terminal 에서 알아냄.
        password : '9gyeresaK/nQ//2OnCYMahZ433dNlUSVrYR5Uh1IDkXVcpGJGD35w9P58VOPtHjGwpgCX1sZf4riJH4gR24hKsV+bYNNx8gwEL+/4Sk5J/udCfZ5p3Dmzenisffz1I8IUP2lXNWxsvfJHmO3oXczPhjWuQm7WnyXelCOEWN0ao0=',
        displayName :'kimilsik'
    },
    // {
    //     username : 'nasuk',
    //     salt : '1231DFSF%#$#',
    //     //password : 'ac536f34dc51048d8be54dd1425f2e57',
    //     password : 'fe3b51034c66598c45cbd1463924a3afc4f1bf47c3f520c75ae9bf346d36114f',
    //     displayName : 'nasuk'
    // }
];
// data

var express = require('express');
var app = express();
var session = require('express-session'); // 모듈
var bodyParser = require('body-parser'); // express는 기본적으로 post방식이 지원이 안되기 때문에 이걸 설치하여야 한다.
var fileStore = require('session-file-store')(session); // file 로 session을 저장하기 위한 것
var fs = require('fs');

// for security
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var assert = require("assert");
var opts = { // opts는 options이다.
    password: "helloworld" // hasher 함수는 첫 번째 인자로 객체를 받고 그 객체 안에
    // password property가 있다면 그것을 암호화한다는 것을 추론한다.
};
// for security

// federation authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// federation authentication

//var app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    secret: 'oiwehrowhvjknasd1@34124901#!@', // random value
    resave : true, // session id 를 접속할 때 마다 새로 발급하는지
    saveUninitialized : false,
    store : new fileStore(), // session데이터를 저장하는 디렉토리를 만든다. 그 이름이 sessions..
    //cookie : {
    //    secure : false,
    //}
}));

// federation authentication
app.use(passport.initialize());
app.use(passport.session());

app.listen(3004, function() {
    console.log('connected 3004 port!!!');
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        var path = './userdata/' + 'local_' + username + '.json';
        // check if there exists a user.
        // if there's no user, go to same login page.
        // if there's a user, go to welcome page.

        fs.readFile(path, function(err, data) {
            if (err) {
                // there is no id like that.
                console.log(err);
                done(null, false);
            } else {
                var user = JSON.parse(data);
                return hasher({password:password, salt:user.salt}, function(err, pass, salt, hash) {
                    if (hash === user.password) {
                        console.log('local strategy succeed.', user);
                        done(null, user);
                    }
                    else {
                        done(null, false);
                    }
                });
            }
        });
    }
));

// passport.use(new LocalStrategy(
//     //var check = false;
//     function(username, password, done) {
//         var check = false;
//         for (var i = 0; i < users.length; ++i)
//         {
//             var str = 'local:' + username;
//
//             if (users[i].authId === str)
//             {
//                 hasher({password : password, salt : users[i].salt},
//                     function(err, pass, salt, hash) {
//                         if (hash === users[i].password) {
//                             check = true;
//                             console.log('localstrategy', users[i]);
//
//
//                             //done(null, users[i]); // login succeed.
//                             // 만일 flash를 쓴다면, 세번째 인자로 message를 보내면 그 메시지가 보여진다.
//                             // null -> error 를 첫 번째 인자로.
//                         }
//                         else
//                         {
//                             //done(null, false);
//                         }
//                     });
//                 //break;
//             }
//         }
//
//         if (check)
//             return done(null, users[i]);
//         else
//             return done(null, false);
//         //done(null, false); // login failure.
//     }
// ));

// nasuk code
// passport.use(new LocalStrategy(
//     //var check = false;
//     function(username, password, done) {
//
//         var check = false;
//         var str = 'local:' + username;
//         var loginUser;
//
//         Promise.all(users.map(function(user) {
//             return new Promise(function (resolve, reject) {
//                 if (user.authId === str) {
//                     hasher({password: password, salt: user.salt},
//                         function (err, pass, salt, hash) {
//                             if (hash === user.password) {
//                                 check = true;
//                                 loginUser = user;
//                                 console.log('localstrategy', loginUser);
//                                 resolve();
//                                 //done(null, users[i]); // login succeed.
//                                 // 만일 flash를 쓴다면, 세번째 인자로 message를 보내면 그 메시지가 보여진다.
//                                 // null -> error 를 첫 번째 인자로.
//                             }
//                             else {
//                                 resolve();
//                                 //done(null, false);
//                             }
//                         });
//                     //break;
//                 } else {
//                     resolve()
//                 }
//             })
//         })).then(function() {
//             if (check) {
//                 done(null, loginUser);
//             } else {
//                 done(null, false);
//             }
//         }).catch(function(err) {
//             console.log(err);
//         });
//     }
// ));

passport.use(new FacebookStrategy({
    clientID : '1594918147219732',
    clientSecret : '76a5953a9487bb7e59d025ca9118851f',
    callbackURL : "/auth/facebook/callback",
    profileFields : ['id', 'email', 'gender', 'link', 'locale', 'name',
    'timezone', 'updated_time', 'verified', 'displayName']
},
    function(accessToken, refreshToken, profile, done) {
        console.log(profile); // -> id, username, displayName, name.familyName, name.givenName, name.middleName,
        // gender, profileUrl, provider 받는다. 이 중 id 가 제일 중요
        // 타사 인증을 통해 로그인한 사용자의 경우 다른 방법으로 정보를 접근해야 한다.

        var auId = 'facebook:'+profile.id;

        // 이미 존재한다면 안되므로, 존재하는지부터 확인해야 한다.

        for (var i = 0; i < users.length; ++i)
        {
            if (users[i].authId === auId)
            {
                return done(null, users[i]);
            }
        }

        var newuser = {
            authId:auId,
            displayName: profile.displayName, // facebook 으로 로그인해도 이게 있다.
            email : profile.emails[0].value
        };

        users.push(newuser);

        return done(null, newuser);


        // fs.readdir('userdata/' + profile.id, function (err, files) {
        //     if (err) {
        //         // 없다면 새로 가입한다.
        //         var newuser = {
        //             authId:auId,
        //             displayName: profile.displayName, // facebook 으로 로그인해도 이게 있다.
        //             email : profile.emails[0].value
        //         };
        //
        //         fs.writeFile('/userdata' + profile, newuser, function (err) {
        //             if (err) {
        //             console.log('File Write Error : ' + err);
        //             res.status(500).send('Internal Server Error');
        //             } else {
        //                 done(null, newuser);
        //             }});
        //     } else {
        //         // there exists a user.
        //         return done(null, files); // 객체를 어떻게 리턴할까?
        //     }
        // });



        // for (var i = 0; i < users.length; ++i)
        // {
        //     if (users[i].authId === auId) {
        //         // facebook 을 통해 가입한 사용자가 이미 있다.
        //         return done(null, users[i]);
        //     }
        // }
        //users.push(newuser);
        //done(null, newuser);
    // find user... or create user
    }
));


passport.serializeUser(function(user, done)
{
    console.log('serializeUser', user);
    return done(null, user.authId); // passport.use 에서 done이 호출될 때 자동으로 호출된다.
    // why we should send only user authid?
    // because it's dangerous to save all the user data to session, right?
    // and heavy.
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    var path = './userdata/' + id + '.json';
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) done('there is no user.'); // we'll not consider error handling for now
        var obj = JSON.parse(data);
        return done(null, obj);
    });

    // for (var i = 0; i < users.length; ++i)
    // {
    //     //if (users[i].username === id)
    //     if (users[i].authId === id)
    //     {
    //         return done(null, users[i]);
    //     }
    // }
    //done('there is no user.');
});

// federation authentication

app.get('/auth/logout', function(req, res) {
    req.logout(); // request 의 logout method 를 호출한다.
    //delete req.session.displayName; // javascript command
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('internal server error');
        } else {
            console.log('logout done!');
            res.redirect('/welcome');
        }
    });
    // req.session.save(function()
    // {
    //     console.log('logout done!');
    //     res.redirect('/welcome');
    // });
});

app.get('/welcome', function(req, res) {
    // passport 를 이용하여 유저 정보에 접근해야.

    // passport 는 user라는 객체로 만들어준다.
    // login 에서 done객체의 users[i]가 user가 된다.
    if (req.user && req.user.displayName)
    //if (req.session.displayName)
    {
        res.send(`
        <h1>hello, ${req.user.displayName}</h1>
        <a href="/auth/logout">logout</a>
        `);
    }
    else
    {
        res.send(`
        <h1>Welcome</h1>
        <a href="/auth/login">Login</a>
        <a href="/auth/register">Register</a>
        `);
    }
});

app.get('/auth/facebook', passport.authenticate(
    'facebook',
    {
        scope : 'email'
    }
));

app.get('/auth/facebook/callback', passport.authenticate('facebook',
    {
        successRedirect : '/welcome',
        failureRedirect : '/auth/login'
    })
);

app.post(
    '/auth/login',
    passport.authenticate(
        'local',
        {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            failureFlash: false // login 페이지로 이동될 때 인증에 실패했다라는 메시지를 보여준다.
            // 아직은 복잡도가 높아서 나중에 사용.
        }
    )
);

app.get('/auth/login', function(req, res) { // p태그는 줄바꿈을 위함.
    var output = `
    <h1>LOGIN</h1>
    <form action="/auth/login" method="post">
        <p> 
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    <a href="/auth/facebook">facebook</a>
    `;
    res.send(output);
});

app.post('/auth/register', function(req, res) {
    // hashing by pbkdf2
    hasher({password:req.body.password}, function(err, pass, salt, hash) {
        var user = {
            authId : 'local_'+req.body.username,
            salt : salt,
            username : req.body.username,
            password : hash,
            displayName : req.body.displayName
        };

        // for (var i = 0; i < users.length; ++i)
        // {
        //     if (users[i].authId === user.authId)
        //     {
        //         return done(null, user);
        //     }
        // }

        // the register process must be in sync?
        // if it's an async process, then what is needed to make it async.

        fs.readdir('./userdata/' + user.authId, function(err, files)
        {
            if (err)
            {
                // no direction,
                // it's a new user
                fs.writeFile('./userdata/' + user.authId + '.json', JSON.stringify(user), 'utf8', function(err) {
                    if (err) {
                        console.log('File Write Error : ' + err);
                        res.status(500).send('Internal Server Error');
                    } else {

                        // if there's no error,
                        // make a user file and have the person logged in.
                        req.login(user, function(err) {
                            req.session.save(function() {
                                res.redirect('/welcome');
                            });
                        });
                        //res.redirect('/topic/' + title);
                    }
                });
            } else {
                // the same authId exists ?????
                // we need to check if the same authId exists in the local.
                // if we're going to do this, then we have to check all the files that if
                // the random file has a same username.
                res.redirect('/auth/login');
            }
        });
    });
});

app.get('/auth/register', function(req, res)
{
    var output = `
    <h1>REGISTER</h1>
    <form action="/auth/register" method="post">
        <p> 
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="text" name="displayName" placeholder="displayName">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;
    res.send(output);
});

// // file example
// app.get('/topic/new', function(req, res) {
//     fs.readdir('data', function(err, files) {
//         if (err)
//         {
//             console.log(err);
//             res.status(500).send('Internal Server Error');
//         }
//         else
//         {
//             res.render('new', {topics : files});
//         }
//     });
//     //res.render('new');
// });
//
//
// // topic으로 들어온 액션을 라우팅한다.
// app.post('/topic', function(req, res) {
//     var title = req.body.title;
//     var desc = req.body.description;
//
//     fs.writeFile('data/' + title, desc, function(err) {
//         if (err)
//         {
//             console.log('filereaderror :' + err); // err 정보는 사용자에게 보내면 안된다.
//             res.status(500).send('Internal Server Error'); // 500 -> error number. for internal use
//         }
//         else
//         {
//             // 사용자의 페이지를 옮겨버림...
//             res.redirect('/topic/' + title);
//             //res.send('success'); // 두번 send할 순 없다??
//             //res.send(title + ' , ' + desc);
//         }
//     });
//
// });
// file example

