/*
mongodb 사용법

이 앱을 켜기 전에 몽고디비가 켜져 있어야 한다.

mongod --dbpath ./data/db


show dbs
use bookstore -> bookstore 만들고 그걸 사용


// resteasy chrome
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(express.static(__dirname + '/client'));

var Genre = require('./models/genre');

var Book = require('./models/books');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// connect to mongoose

mongoose.connect('mongodb://localhost/bookstore');
var db = mongoose.connection;

app.get('/', function(req, res) {
   //res.send('hello world');
    res.send('please use /api/books or /api/')
});

app.get('/api/genres', function(req, res) {
    Genre.getGenres(function(err, genres) {
        if (err) {
            throw err;
        }
        res.json(genres);
    });
});

app.post('/api/genres', function(req, res) {
    var genre = req.body;

    Genre.addGenre(genre, function(err, g) {
        if (err) {
            throw err;
        }
        res.json(g);
    });
});

app.put('/api/genres/:_id', function(req, res) {
    var id = req.params._id;
    var genre = req.body;

    Genre.updateGenre(id, genre, {}, function(err, g) {
        if (err) {
            throw err;
        }
        res.json(g);
    });
});

app.delete('/api/genres/:_id', function(req, res) {
    var id = req.params._id;

    Genre.deleteGenre(id, function(err, g) {
        if (err) {
            throw err;
        }
        res.json(g);
    });
});

app.get('/api/books', function(req, res) {
    Book.getBooks(function(err, books) {
        if (err) {
            throw err;
        }
        res.json(books);
    });
});

app.post('/api/books/add', function(req, res) {
    var book = req.body.book;
    console.log('post request executed...');

    Book.addBook(book, function(err, b) {
        if (err) {
            throw err;
        }
        res.json(b);
    });
});

app.get('/api/books/:_id', function(req, res) {
    Book.getBookById(req.params._id, function(err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});

app.put('/api/books/:_id', function(req, res) {
    var id = req.params._id;
    var book = req.body;

    Book.updateBook(id, book, {}, function(err, b) {
        if (err) {
            throw err;
        }
        res.json(b);
    });
});

app.delete('/api/books/:_id', function(req, res) {
    var id = req.params._id;

    Book.deleteBook(id, function(err, b) {
        if (err) {
            throw err;
        }
        res.json(b);
    });
});

app.listen(3000, function() {
    console.log('start running on port 3000');
});