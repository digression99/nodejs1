/**
 * Created by kimilsik on 5/31/17.
 */
// no. 14


/**
 * Created by kimilsik on 5/30/17.
 */
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
// res.setHeader('Content-Type', 'text/plain');
// res.end('Hello World\n');
// });
//
// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

const server = http.createServer(function(req, res) {
    // req : request, res : response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(port, hostname, function() {
    // this callback function is called when listening is finished.
    console.log(`Server running at http://${hostname}:${port}/`);
})