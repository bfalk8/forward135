'use strict';
//import * as socket from 'socket.io';
var socket = require('socket.io');

class SocketHandler {
    constructor(http){
        this.io = socket(http);
        this.io.on('connection', (socket) => {this.handleSocket(socket)});
    }

    getIo() {
        return this.io;
    }

    handleSocket(socket) {
        socket.on('echo', (data)=>{this.echo(socket, data)});
        socket.on('init query', (data) => {this.checkRoom(socket, data)});
    }

    checkRoom(socket){
        console.log("CHECK ROOM: " + data);
    }
    
    echo(socket, data) {
        socket.emit('echo', data);
    }

}

module.exports =  SocketHandler;