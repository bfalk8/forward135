'use strict';

// let instance      = null;
var SocketHandler = require('./SocketHandler');
const IVM = {
    socketHandler: new SocketHandler(),

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

    tableUpdate: (change) =>
    {
        console.log(change);
    }
};

module.exports = IVM;