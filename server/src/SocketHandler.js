'use strict';
//import * as socket from 'socket.io';
var socket = require('socket.io');
var ivm = require('./IVM');

class SocketHandler {
    constructor(http){
        this.io = socket(http);
        this.io.on('connection', (socket) => {this.handleSocket(socket)});
    }

    getIo() {
        return this.io;
    }

    handleSocket(socket) {
        console.log("connected");
        socket.on('echo', (data)=>{this.echo(socket, data)});
        socket.on('init query', (data) => {this.checkRoom(socket, data)});
    }

    checkRoom(socket, data){
        console.log("CHECK ROOM: " + data);
        var query = data.query;
        if(this.io.rooms.indexOf(query) >= 0){
            socket.join(query);
            socket.emit('init query', {data: 'initial query'});
        }
        
    }
    
    echo(socket, data) {
        socket.emit('echo', data);
    }

}

module.exports =  SocketHandler;