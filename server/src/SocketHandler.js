'use strict';
//import * as socket from 'socket.io';
var socket = require('socket.io'); // added listen

class SocketHandler {
    constructor(http){
        this.io = socket(http);
        this.io.on('connection', this.handleSocket);
    }

    getIo() {
        return this.io;
    }

    handleSocket(socket) {
        console.log("fuck off!");
        console.log(socket);


        // Used for test
        this.io.on("echo", function(msg, callback){
            callback = callback || function(){};

            this.io.emit("echo", msg);

            callback(null, "Done.");
        });
    }

}

module.exports =  SocketHandler;