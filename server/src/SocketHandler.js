'use strict';

var socket = require('socket.io');
var IVM = require('./IVM');
let self = null;

class SocketHandler {
    constructor(http){
        if(!self) {
            this.io = socket(http);
            this.ivm = new IVM();
            this.io.on('connection', this.handleSocket);
            self = this;
        }
        return self;
    }

    handleSocket(socket) {
        console.log('connected');
        socket.on('echo', (data)=>{self.echo(socket, data)});
        socket.on('init query', (data) => {self.checkRoom(socket, data)});
    }

    checkRoom(socket, data){
        console.log('CHECK ROOM: ' + data);
        var query = data;
        if(!this.io.sockets.adapter.rooms[query]){
            console.log('Room: ' + query + ' created!');
            this.ivm.addQuery(query);
        } else {
            console.log('Room: ' + query + ' exists!');
        }
        new IVM().addQuery(query);
        socket.join(query);
        socket.emit('init query', {data: 'initial query result'});
        socket.emit('diff query', new IVM().getQuery(query));
    }
    
    echo(socket, data) {
        socket.emit('echo', data);
    }

    sendQueryDiff(diff) {
        var query = diff.query;
        this.io.to(query).emit(diff);
    }

}

module.exports =  SocketHandler;