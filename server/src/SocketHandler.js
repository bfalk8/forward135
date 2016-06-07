'use strict';

var socket = require('socket.io');
// var IVM = require('./IVM');
// let handler = null;
var handler;
class SocketHandler {

    constructor(http){
        if(!handler) {
            this.io = socket(http);
            this.ivm = require('./IVM');
            this.io.on('connection', this.handleSocket);
            handler = this;
        }

        return handler;
    }

    handleSocket(socket) {
        console.log('connected');
        socket.on('echo', (data)=>{handler.echo(socket, data)});
        socket.on('init query', (data) => {handler.checkRoom(socket, data)});
    }

    checkRoom(socket, data){
        console.log('CHECK ROOM: ' + data);
        var table = data.table;
        var query = data.query;
        if(!this.io.sockets.adapter.rooms[query]){
            console.log('Room: ' + query + ' created!');
            handler.ivm.addQuery(table, query, (results)=>{
                socket.emit('init query', {data: results});
            });
        } else {
            console.log('Room: ' + query + ' exists!');
        }

        socket.join(query);
        // socket.emit('init query', {data: 'initial query result'});
    }

    echo(socket, data) {
        socket.emit('echo', data);
    }

    sendQueryDiff(query, diff) {
        // console.log('here we are in socket', diff);
        handler.io.to(query).emit('diff query', diff);
    }

}

module.exports = SocketHandler;
