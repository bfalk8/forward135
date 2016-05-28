'use strict';

// var IVM           = require('./IVM');
var SocketHandler    = require('./SocketHandler');
var RandomUpdater    = require('./RandomUpdater');
var DatabaseListener = require('./DatabaseListener');

class Main {

    constructor(http) {
        this.socket   = new SocketHandler(http);
        this.database = new DatabaseListener();
        this.database = new Database(30);
        this.ivm      = require('./IVM');
        this.updater  = new RandomUpdater(this.database, -1, 5000, this.ivm);
    }

    run() {
        this.updater.start(this.ivm.changeInsertDiff);
    }
}

module.exports = Main;