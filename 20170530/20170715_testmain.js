/**
 * Created by kimilsik on 7/15/17.
 */

var date = new Date();
var y = date.getFullYear();
var mon = date.getMonth();
var day = date.getDate();
var hour = date.getHours();
var min = date.getMinutes();
var sec = date.getSeconds();

console.log(y + "." + mon + "." + day + "/" + hour + ":" + min + ":" + sec);
console.log(date.getMilliseconds());
console.log(date.getUTCMilliseconds());

// console.log(date.getDate());
// console.log(date.getDay());
// console.log(date.getFullYear());
// console.log(date.getHours());
// console.log(date.getMinutes());
// console.log(date.getSeconds());
// console.log(date.getMonth());


