'use strict';

// var IVM           = require('./IVM');
var SocketHandler    = require('./SocketHandler');
var RandomUpdater    = require('./RandomUpdater');
var DatabaseListener = require('./DatabaseListener');
var Database         = require('./MockDatabase');

class Main {

    constructor(http, dbconstring) {
        this.socket   = new SocketHandler(http);
        this.dbListener = DatabaseListener.init(dbconstring);
        this.database = new Database(30);
        this.ivm      = require('./IVM').init();
        this.updater  = new RandomUpdater(10, 5000);
    }

    run() {
        this.updater.start();
    }
}

module.exports = Main;
