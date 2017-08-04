/**
 * Created by kimilsik on 7/7/17.
 */


/*

create module so I could reuse the module or
just to refactor codes.

lower the complexity of the software.

 */


//var o = require('os');
//console.log(o.platform());

var mymodule = require('./lib/sum');

console.log(mymodule.sum(1, 2));

console.log(mymodule.privateMessage(3, 4));

// can't use privatefunc.
//console.log(mymodule._privatefunc(3, 4));

var cal = require('./lib/calculator');
console.log('calsum : ' + cal.sum(1, 2));
console.log('cal avg : ' + cal.avg(1, 2));

