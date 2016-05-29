'use strict';
var SocketHandler    = require('./SocketHandler');

class Main {

    constructor(http, dbconstring) {
        this.socket   = new SocketHandler(http);
        this.dbListener = require('./DatabaseListener');
        this.dbListener.init(dbconstring);
        this.ivm      = require('./IVM');
        this.ivm.init();
    }

    run() {
        //this.updater.start(this.ivm.changeInsertDiff);
    }
}

module.exports = Main;