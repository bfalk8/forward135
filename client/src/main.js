import Greeting from './Greeting.js';
import WebSocket from './WebSocket.js';
var h1 = document.querySelector('h1');
h1.textContent = new Greeting();

let socket = WebSocket.socket;

socket.emit('init query', 'select *');

