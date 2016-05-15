'use strict';

var socket = require('socket.io'), ivm = require('./IVM'), self;

class SocketHandler {
    constructor(http){
        self = this;
        this.io = socket(http);
        this.io.on('connection', this.handleSocket);

    }

    handleSocket(socket) {
        console.log('connected');
        socket.on('echo', (data)=>{self.echo(socket, data)});
        socket.on('init query', (data) => {self.checkRoom(socket, data)});
    }

    checkRoom(socket, data){
        console.log('CHECK ROOM: ' + data);
        var query = data.query;
        if(this.io.rooms.indexOf(query) >= 0) {
            socket.join(query);
            socket.emit('init query', {data: 'initial query'});
        }
    }
    
    echo(socket, data) {
        socket.emit('echo', data);
    }

}

module.exports =  SocketHandler;