/**
 * Created by kimilsik on 7/7/17.
 */
/**
 * Created by kimilsik on 7/5/17.
 */
/*

refactoring codes

app.use(passport.session()) 은
request에 user등의 인자를 넣어줄 때 호출되는데,
이게 밑부분에 있으면 호출이 안되므로 문제가 발생한다.

 */

var app = require('./config/express')();
var passport = require('./config/passport')(app);


var routs = require('./routes')();

var passport = require('./config/passport')(app);
var auth = require('./auth')(passport);
app.use('/auth', auth);
app.use(routs);

app.listen(3004, function() {
    console.log('connected 3004 port!!!');
});
