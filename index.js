var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

var routes = require('./server/routes/index');

app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});