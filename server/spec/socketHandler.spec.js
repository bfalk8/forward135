'use strict';

var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

// var io = require('socket.io-client');
var socketHandler, handler, server, http;

describe('Socket Handler Suite', function(){
    
    beforeEach(function(done){
        socketHandler = require('../src/SocketHandler');
        http = require('../../index.js').http;
        // http = server.http;
        handler = new socketHandler(http);

        done();
    });

    xit('should echo input data', (done) => {
        handler.echo(handler.io, "test");
    });


});