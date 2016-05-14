'use strict';

var self, socket = require('socket.io'); 

class SocketHandler {
    constructor(http){
        self = this;
        this.io = socket(http);
        this.io.on('connection', this.handleSocket);

    }

    getIo() {
        return this.io;
    }

    handleSocket(socket) {
        socket.on('echo', (data)=>{self.echo(socket, data)});
        socket.on('init query', (data) => {self.checkRoom(socket, data)});
    }

    checkRoom(socket){
        console.log("CHECK ROOM: " + data);
    }
    
    echo(socket, data) {
        socket.emit('echo', data);
    }

}

module.exports =  SocketHandler;