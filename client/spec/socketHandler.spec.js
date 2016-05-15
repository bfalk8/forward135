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
        client = io.connect('http://localhost:3000', options);

        client.on('connect', function() {
            console.log('connecting...');
            done();
        });

        client.on('echo', function(msg){
            console.log('reached echo');
            m = msg;
            done();
        });

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



        client.emit('echo', 'Hello TEST');


        m.should.equal('Hello World');



        done();
    });

    xit('should check the room', function(done){

        var client = io.connect('http://localhost:3000', options);

        client.emit('init query', 'SELECT * from bitches WHERE category = pawg');

        client.once('connection', function() {
            client.once('init query', function(msg){
                msg.should.equal({data: 'initial query'});

                client.disconnect();
                done();
            });
        });

        done();
    });
});