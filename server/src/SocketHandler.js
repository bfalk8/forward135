'use strict';
//import * as socket from 'socket.io';
var socket = require('socket.io');

class SocketHandler {
    constructor(http){
        this.io = socket(http);
        //this.io.on('connection', this.handleSocket(socket));
    }

    getIo() {
        return this.io;
    }

    handleSocket(socket) {
        console.log("fuck off!");
        console.log(socket);
    }

}

module.exports =  SocketHandler;