'use strict';

var SocketHandler = require('./SocketHandler');
var DatabaseQuery = require('./DatabaseQuery');
var DAO           = require('./DAO');

const IVM = {
    socketHandler: new SocketHandler(),

    // dao: new DAO(con),

    queries: {},

    addQuery: (query) =>
    {
        this.queries[query] = {
            query: query,
            insertDiff: 'hey you got a query',
            updateDiff: 'hey you got an update',
            deleteDiff: 'hey you got a delete'
        };
    },

    /**
     * change is the result of the watcher function, has the following format
     * change: {table: '<table that changed>', column: '<column the id is associated with>', id: '<id of new tuple>'}
     * @param change
     */
    tableUpdate: (change) =>
    {
        console.log(change);
        new DatabaseQuery('postgres://postgres:test@localhost:5432/forward135', 'select * from foo');
    }
};

module.exports = IVM;