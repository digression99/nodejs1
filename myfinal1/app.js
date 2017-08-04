/**
 * Created by kimilsik on 7/11/17.
 */
/*

project specification

* login
- facebook, google login through passport.js
- later, use oauth to do the authentication.
- first, set the local login system.

* database -> orientDB

* function
- save title, contents, dates.
    -> save them in the database.
    -> the writings should be saved by users.
    -> so, you should make another table to save the data.

- 자기의 글만 볼 수 있는 기능
-   다른 사람의 글도 다 볼 수 있게 하고,
    내가 그 글을 썼다면 그 글을 수정하거나 지울 수 있게 하자.

20170712
* 기능 추가하기
- 일단 자기만 자기의 글을 편집하고 삭제할 수 있는 기능.
-> 자기 글을 편집하고 삭제할 수 있는 기능을 구현하려면
일단 모든 사람의 글을 다 볼 수 있고, 각 글은 edit, delete가 가능해야 한다.
근데 일단 어떤 글을 눌러야만 edit, delete가 보인다.
-> 먼저 delete 부터 구현해보자.

* 코드 수정하기
- 이미 데이터베이스에 들어있는 아이디, 즉 authId로 쓰일 username은 유니크해야 한다. / o
따라서 코드에서 입력이 들어왔을 시 유니크 체크를 하고, 중복이 있다면 중복을 알려주는 페이지로 이동해야 한다. / o
-> 이거는 pug를 이용해 구현 가능하다. 만일 문제가 발생하면 message와 함께
다시 register화면으로 돌아가는 코드를 작성해야 한다.

[20170714]

- 오늘 할 것들
-> edit post 완성하기 / o
-> 남이 edit하려하면 안되게 하기 / o
-> 모든 프로젝트를 아우르는 메인 페이지 완성하고 두번째 프로젝트 페이지 넣기
-> 컨텐츠에 디스플레이네임까지 저장하고 있어야 한다... 없으면 undefined...


- 프로젝트 전체를 다시 설계
-> 이 쇼핑카트 프로젝트를 메인의 하나의 카테고리로 만들고,
다른 카테고리는 johnnyfive를 활용한 라즈베리파이 컨트롤 프로젝트를 위한
페이지로 만들자. 즉 이런 식으로 나의 홈페이지를 확장해 나가야 한다.

- 댓글 기능 넣으려면 글 밑에 글 쓸 수 있는 것 넣고, 그 상황에서 서브밋 누르면
댓글 오브젝트가 생성되고 그 오브젝트는 또 다른 댓글 오브젝트를 가질 수 있다.
그렇게 재귀적으로 출력하는 건 어떻게 할까???
-> 재귀적으로 모든 댓글 오브젝트를 다 가져와서 깊이와 해당 댓글 오브젝트의 연관에 따라 저장한 후,
그것을 pug에서 자바스크립트 코드로 처리한다.
-> 댓글은 javascript로 처리해야 하는가..
-> 페이지가 바뀔 때 전에 있었던 페이지에서 어떤 댓글들이 있었는지를 확인하고 그것들을 디비로 넣는 작업이 가능할 것인가..

[20170715]

- 추가하고 싶은 것들
[1] 게시판을 나누고 그 게시판에 따라서 글들을 분류할 수 있다.
-> 그리고 나중에 게시판을 묶음으로 나눠 게시판 자체도 분류하게끔.
[2] 글에 따라 댓글들을 디비에 저장하고, 댓글들을 언제나 불러올 수 있다.
-> 어떤 댓글이 어떤 게시글에 달렸는지, 그리고 누가 썼는지, 내용이 뭔지, 댓글의 댓글은 어떻게 저장되는지
-> 이런 것들을 잘 생각해서 데이터베이스에 저장하면 된다.
-> list 1, list 2 로 나누었는데, 이때 각 리스트에 따라서 글들을 분류하고, 그 리스트에 해당되는 글들만 보여주게끔 한다.

[3] 게시글에 시간 정보 저장하기, 보여주기.
-> 시간을 초로 변환한 다음에 변수 하나로 저장해도 된다...
-> edit 했을 때는 edit 했을 때의 시간을 보여주어야 한다.
[4] datas.pug를 main.pug에 상속할 수 있는 방법을 찾아보자.

[4] 조회수??? -> get 할 때 마다 저장된 조회수에 1 더해 다시 업데이트 하면 될 듯..

[5] time out 기능?
-> 어떤 사람이 페이지에 들어갈 때 시간이 정해진 토큰을 심는다.
-> 그리고 제출 시간과 토큰 시간을 비교하여 특정 값을 넘는다면 expired를 시전.

[6] html, css 기술을 좀더 깊게 배워서 다양한 기술들을 넣어보자.
-> nav, div, main, section, article 등의 시멘틱 태그들을 활용하여,
-> 프로그래밍식으로 pug를 이용하여 더 페이지를 꾸며보자. 너무 만족스러울 것이다.

- 중요 사실들
->pug : extends 했다면, 그 extends한 파일을 써야 한다. 그렇다면 하나의 파일에 여러가지를 extends를 했다면?
-> 일단 if 때문에 그런건지 확실한 이유는 모르겠으나, 하나의 파일에 블록을 삽입한다면 일단은 그냥 되는 듯 하다..
-> 아 알듯 하다. 그니까 extends 한 파일에 extends 의 부모 파일에 있는 여러 블록들을 넣어야 한다.

-> pug 파일 구성 -> layout 이 가장 밑에 있다. 그리고 그 레이아웃에 들어갈 헤더, 푸터 등의 블록들이 그 다음.
-> 그리고 마지막으로 컨텐츠 파일이 그 다음에 상속.


Q. Can I use several databases?
-> for example, If I were to use orientdb, then I can use db o2
-> that means in the first place, I declare that I will use database named o2
-> then can I use another database named o3?

Q. Can I use several apps?
-> in app.use, I used specific views files to one app object.
-> If I want to use another views file, then the app I used before
-> should change the views files settings. I want to avoid that.
-> No!...

Q. 만일 어떤 사람이 로그인을 안한 상태에서 바로 쇼핑카드 테이블로 주소를 옮겼다면, 어떻게 거부해야 할까..
-> on every router, should I check if req.user.authId is not available?
-> then redirect to login page?

-> then, I can overcome this.
-> for example, in views file, there could be many directory that could
-> divide the whole projects. you can use that directory for the whole projects

 */

/*
raspberry pi project
- bluetooth test module 작성.
    마우스나 에어팟을 처음에 연결해 보고,
    그 후에 핸드폰으로 연결해서 와이파이에 접속할 수 있는 정보를 받아오는 과정을 구현해보자.

- oauth로 인증 체계 세우기. -> 이거는 shoppingcart project에서 먼저 해보자.




 */



//shoppingcart
var app = require('./config/shoppingcart/express')();
var db = require('./config/shoppingcart/db')();
var passport = require('./config/shoppingcart/passport')(app, db);

app.use(passport.initialize());
app.use(passport.session());

var main = require('./routes/shoppingcart/main')();
var table = require('./routes/shoppingcart/table')(db);
var auth = require('./routes/shoppingcart/auth')(passport, db);

app.use('/shoppingcart/table', table);
app.use('/shoppingcart',main);
app.use('/shoppingcart',auth);
// shoppingcart

app.get('/', function(req, res) {
    res.render('main');
});

app.listen(3000, function() {
    console.log('listening on 3000!');
});




















