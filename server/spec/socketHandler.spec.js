var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var io = require('socket.io-client');

describe("Server Suite", function(){
    var server,
        options = {
            transports: ['websocket'],
            'force new connection': true
        };

    beforeEach(function(done){
        // start server
        server = require('../../index.js').server;

        done();
    });

    it("should echo a message", function(done){
        var client = io.connect("http://localhost:3000", options);

        client.once("connection", function() {
            client.once("echo", function(msg){
                msg.should.equal("Hello World");

                client.disconnect();
                done();
            });
        });

        client.emit("echo", "Hello World");
        done();
    });
    
    it("should return a SocketHandler", function(done){
        var client = io.connect("http://localhost:3000", options);

        client.once("connection", function() {
            client.once("echo", function(msg){
                msg.should.equal("Hello World");

                client.disconnect();
                done();
            });
        });

        client.emit("echo", "Hello World");
        done();
    });
});