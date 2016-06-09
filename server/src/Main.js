'use strict';

var SocketHandler = require('./SocketHandler');
var RandomUpdater = require('./RandomUpdater');

class Main {

    constructor(http, dbconstring) {
        new SocketHandler(http);
        require('./DatabaseListener').init(dbconstring);
        require('./IVM').init();
        this.updater = new RandomUpdater(-1, 50, 1000);
    }

    run() {
        this.updater.start();
    }
}

module.exports = Main;
