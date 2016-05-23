var chai = require('chai'),
    should = chai.should;

var io = require('socket.io-client');

var socketURL = 'http://127.0.0.1:3000';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

describe('Socket Handler Suite', function(){
    var client;

    beforeEach(function(done){
        client = io.connect(socketURL, options);

        client.on('connect', function() {
            console.log('connecting...');
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

        client.emit('echo', 'Hello World');

        client.on('echo', function(data){
            data.should.equal('Hello World');
            done();
        });

    });

    it('should check the room', function(done){

        client.emit('init query', 'SELECT dat.ass FROM bitches dat WHERE dat.ass = fat');

        client.on('init query', function(data){
            data.should.deep.equal({data: 'initial query result'});
            done();
        });
    });
});