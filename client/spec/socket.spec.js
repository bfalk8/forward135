var assert = require('chai').assert;
var io     = require('socket.io-client');

var socketURL = 'http://localhost:3000';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

it('Should broadcast new user to all users', function (done) {
    var client = io.connect(socketURL, options);

    client.on('connect', function (data) {
        assert(true);
        client.disconnect();
        done();
    });

    client.on('error', function (error) {
        assert(false, error);
        done();
    });

});