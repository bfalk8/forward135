var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should(),
    assert = chai.assert(),
    expect = chai.expect();

var io = require('should.io-client');

describe("Server Suite", function(){
    var server,
        options = {
            transports: ['websocket'],
            'force new connection': true
        };

    beforeEach(function(done){
        // start server
        server = require('../index.js').server;

        done();
    });

    it("should echo a message", function(done){
        var client = io.connect("http://localhost:3000", options);

        client.once("connect", function() {
            client.once("echo", function(msg){
                msg.should.equal("Hello World");

                client.disconnect();
                done();
            });
        });

        client.emit("echo", "Hello World");
    });
});