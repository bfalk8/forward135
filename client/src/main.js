import Greeting from './Greeting.js';
import io from 'socket.io-client';

let socket = io(`http://localhost:3000`);
localStorage.debug = true;

socket.on('connect', () => console.log('connected'));

socket.on('message', msg => console.log(msg) );

socket.on('disconnect', () => console.log('disconnected') );

socket.on('error', e => console.log('System', e ? e : 'A unknown error occurred'));

var h1 = document.querySelector('h1');
h1.textContent = new Greeting();
