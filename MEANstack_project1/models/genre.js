var mongoose = require('mongoose');

var genreSchema = mongoose.Schema({
    name : { // schema에서 name을 자동으로 인식한다.
        type : String,
        required : true
    },
    create_date : {
        type : Date,
        default : Date.now()
    }
});

var Genre = module.exports = mongoose.model('Genre', genreSchema);

// get genres
module.exports.getGenres = function(callback, limit) {
    Genre.find(callback).limit(limit);
};

module.exports.addGenre = function(genre, callback) {
    Genre.create(genre, callback);
};

module.exports.updateGenre = function(id, genre, options, callback) {
    var query = {_id : id};
    var update = {
        name : genre.name
    };
    Genre.findOneAndUpdate(query, update, options, callback);
};

module.exports.deleteGenre = function(id, callback) {
    var query = {_id : id};
    Genre.remove(query, callback);
}