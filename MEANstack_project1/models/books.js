var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    title : { // schema에서 name을 자동으로 인식한다.
        type : String,
        required : true
    },
    genre : { // schema에서 name을 자동으로 인식한다.
        type : String,
        required : true
    },
    description : { // schema에서 name을 자동으로 인식한다.
        type : String
    },
    author : { // schema에서 name을 자동으로 인식한다.
        type : String,
        required : true
    },
    publisher : { // schema에서 name을 자동으로 인식한다.
        type : String
    },
    pages : { // schema에서 name을 자동으로 인식한다.
        type : String
    },
    image_url : { // schema에서 name을 자동으로 인식한다.
        type : String
    },
    buy_url : { // schema에서 name을 자동으로 인식한다.
        type : String
    },

    create_date : {
        type : Date,
        default : Date.now()
    }
});

var Book = module.exports = mongoose.model('Book', bookSchema);

// get genres


module.exports.getBooks = function(callback, limit) {
    Book.find(callback).limit(limit);
};


module.exports.getBookById = function(id, callback) {
    Book.findById(id, callback);
    //Book.find(callback).limit(limit);
};

module.exports.addBook = function(book, callback) {
    Book.create(book, callback);
};

module.exports.updateBook = function(id, book, options, callback) {
    var query = {_id : id};
    var update = {
        title : book.title,
        genre : book.genre,
        description : book.description,
        author : book.author,
        publisher : book.publisher,
        pages : book.pages,
        image_url : book.image_url,
        buy_url : book.buy_url
    };
    Book.findOneAndUpdate(query, update, options, callback);
};

module.exports.deleteBook = function(id, callback) {
    var query = {_id : id};
    Book.remove(query, callback);
};