'use strict';

var SocketHandler = require('./SocketHandler');
var DatabaseQuery = require('./DatabaseQuery');

let Tables        = require('./Tables');


const IVM = {
    queries: {},
    tables: {},

    init: () => {
        this.tables = new Tables();
        this.socketHandler = new SocketHandler();
    },

    addQuery: (tName, query) => {
        this.tables.table(tName).query = query;
        console.log('added query');
    },

    /**
     * change is the result of the watcher function, has the following format
     * change: {table: '<table that changed>', column: '<column the id is associated with>', id: '<id of new tuple>'}
     * @param change
     */
    tableUpdate: change => {
        var queries = this.tables.table(change.table);
        console.log(queries);
    }
};

module.exports = IVM;