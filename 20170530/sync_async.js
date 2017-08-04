/**
 * Created by kimilsik on 5/31/17.
 */
var fs = require('fs');
console.log(1);

//sync
var data = fs.readFileSync('data.txt', {encoding : 'utf8'});
console.log(20);
console.log(data);

//async
fs.readFile('data.txt', {encoding : 'utf8'}, function(err, data) {
    console.log(3);
    console.log(data);
});

console.log(4);
