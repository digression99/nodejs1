/**
 * Created by kimilsik on 6/11/17.
 */

var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
    var led = new five.Led(13);
    led.blink(500);
});