import Greeting from './Greeting.js';
import io from 'socket.io-client';

localStorage.debug = true;
let socket = io(`http://localhost:3000`);

socket.on('connect', function() {
    console.log('connected');
});

socket.on('message', function(msg){
    console.log(msg);
});

socket.on('disconnect', function() {
    console.log('disconnected');
});

socket.on('error', function (e) {
    console.log('System', e ? e : 'A unknown error occurred');
});

var h1 = document.querySelector('h1');
h1.textContent = new Greeting();
