import io from 'socket.io-client';
class WebSocket {

    constructor() {
        localStorage.debug = '*';
        this.init();
    }

    init() {
        let host = window.location.origin;
        console.log("WEBSOCKET connecting to", host);

        this.socket = io.connect(host);

        this.socket.on('connect', () => {
            let sessionId = this.socket.io.engine.id;
            console.log("WEBSOCKET connected with session id", sessionId);
            this.socket.emit('init query', 'select * from bitches where ass = "phat"');
        });

        this.socket.on('disconnect', () => console.log('disconnected') );

        this.socket.on('error', e => console.log('System', e ? e : 'A unknown error occurred'));

        this.socket.on('init query', (data)=>{console.log(data)});

        this.socket.on('diff query', (data)=>{console.log(data)});
    }
}

let websocket = new WebSocket();
export default websocket;