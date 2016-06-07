import Greeting from './Greeting.js';
import WebSocket from './WebSocket.js';
import Log from './Log';

var h1 = document.querySelector('h1');
h1.textContent = new Greeting();

let socket = WebSocket.socket;

socket.emit('init query', {table: 'orders', query: 'select * from orders'});

var insertLog = new Log('insertLog');
socket.io.on('diff query', (data) => {
    insertLog.appendLog(data);
});

