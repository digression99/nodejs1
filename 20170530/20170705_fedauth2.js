/**
 * Created by kimilsik on 7/5/17.
 */
/*

federation authentication을 이용하면
거대 자본에게 보안 문제를 맡기고
좀더 서비스에 집중할 수 있는 이점이 있다

따라서 내부 정보는 간단하게 식별자정도만 저장하고
서비스에 필요한 정보만 저장하면 된다

대신 다른 서비스에 종속되는 느낌은 있다

다른 서비스와 interaction 할 수 있는 기회도 있다

 <script>
 window.fbAsyncInit = function() {
 FB.init({
 appId      : '1594918147219732',
 cookie     : true,
 xfbml      : true,
 version    : 'v2.8'
 });
 FB.AppEvents.logPageView();
 };

 (function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
 </script>

 FB.getLoginStatus(function(response) {
 statusChangeCallback(response);
 });

 app id : 1594918147219732
 app secret 은 절대 노출하면 안된다

 {
 status: 'connected',
 authResponse: {
 accessToken: '...',
 expiresIn:'...',
 signedRequest:'...',
 userID:'...'
 }
 }

app.get('/auth/facebook')...
app.get('/auth/facebook/callback', ...

왜 두개가 필요할까

페이스북에서 확인을 누르면 callback으로 다시 넘어온다. 여러 정보와 함께.

/// 왜 언제는 deserialize가 호출되고 언제는 안되는걸까. 이유가 뭘까.

users는 배열 -> 메모리에 있으므로 앱이 꺼지면 사라진다.
session은 파일에 있으므로 남아있다.

/// permissions -> email 등의 정보를 얻고 싶다면 사용한다.
scope 이용.
scope 을 바꾸면 다시 사용자에게 확인을 한다.
email ->비밀번호를 잊었을 경우 등등..

이메일을 통해 인증하기 등등을 구현해보면 좋다.

%% facebook을 통해 로그인한 사람은 어떻게 저장되는가 -> passport.use
 */

////////////////////////////////////////////////


var users = [
    {
        //id : 1,
        authId : 'local:kimilsik',
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

// passport.use(new LocalStrategy(
//     //var check = false;
//     function(username, password, done) {
//         var check = false;
//         for (var i = 0; i < users.length; ++i)
//         {
//             var str = 'local:' + username;
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

passport.use(new LocalStrategy(
    //var check = false;
    function(username, password, done) {

        var check = false;
        var str = 'local:' + username;
        var loginUser;

        Promise.all(users.map(function(user) {
            return new Promise(function (resolve, reject) {
                if (user.authId === str) {
                    hasher({password: password, salt: user.salt},
                        function (err, pass, salt, hash) {
                            if (hash === user.password) {
                                check = true;
                                loginUser = user;
                                console.log('localstrategy', loginUser);
                                resolve();
                                //done(null, users[i]); // login succeed.
                                // 만일 flash를 쓴다면, 세번째 인자로 message를 보내면 그 메시지가 보여진다.
                                // null -> error 를 첫 번째 인자로.
                            }
                            else {
                                resolve();
                                //done(null, false);
                            }
                        });
                    //break;
                } else {
                    resolve()
                }
            })
        })).then(function() {
            if (check) {
                done(null, loginUser);
            } else {
                done(null, false);
            }
        }).catch(function(err) {
            console.log(err);
        });
    }
));

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
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);

    for (var i = 0; i < users.length; ++i)
    {
        //if (users[i].username === id)
        if (users[i].authId === id)
        {
            return done(null, users[i]);
        }
    }
    done('there is no user.');
});

// federation authentication

app.get('/auth/logout', function(req, res) {
    req.logout(); // request 의 logout method 를 호출한다.
    //delete req.session.displayName; // javascript command
    req.session.destroy(function (err) {
        console.log('logout done!');
        res.redirect('/welcome');
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
            authId : 'local:'+req.body.username,
            salt : salt,
            username : req.body.username,
            password : hash,
            displayName : req.body.displayName
        };

        for (var i = 0; i < users.length; ++i)
        {
            if (users[i].authId === user.authId)
            {
                return done(null, user);
            }
        }


        fs.readdir('userdata/' + user.authId, function(err, files) {
            if (err) {
                // it's a new user
                fs.writeFile('userdata/' + user.authId, user, function(err) {
                    if (err) {
                        console.log('File Write Error : ' + err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        req.login(user, function(err) {
                            req.session.save(function() {
                                res.redirect('/welcome');
                            });
                        });
                        //res.redirect('/topic/' + title);
                    }
                });
            } else {
                // the same user exists.
                res.redirect('/auth/login');
            }
        });

        users.push(user);

        // passport 가 넣어주는 함수 -> login()
        req.login(user, function(err) {
            req.session.save(function() {
                res.redirect('/welcome');
            });
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

