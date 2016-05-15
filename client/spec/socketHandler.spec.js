'use strict';

var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var io = require('socket.io-client');

describe('Socket Handler Suite', function(){
    var server, client, m = '',
        options = {
            transports: ['websocket'],
            'force new connection': true
        };

    beforeEach(function(done){
        client = io.connect('http://localhost:3000');

        client.on('connect', function() {
            console.log('connecting...');
            done();
        });

        // client.on('echo', function(msg){
        //     console.log('reached echo');
        //     m = msg;
        //     done();
        // });

        client.on('disconnect', function(){
            console.log('disconnected...');
        });



    });

    afterEach(function(done){
        //Cleanup
        if(client.connected){
            console.log('disconnecting...');
            client.disconnect();
        }else{
            console.log('no connection to break...');
        }

        done();
    });

    it('should echo a message', function(done){

        client.emit('echo', 'Hello World');

        client.on('echo', function(data){
            data.should.equal('Hello World');
            done();
        });

    });

    it('should check the room', function(done){

        client.emit('init query', 'SELECT dat.ass FROM bitches dat WHERE dat.ass = fat');

        client.on('init query', function(data){
            data.should.equal('initial query result');
            done();
        });
    });
});