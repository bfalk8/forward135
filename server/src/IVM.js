'use strict';

// let instance      = null;
var SocketHandler = require('./SocketHandler');
function IVM() {
    var ivm      = this;
    var socketHandler = new SocketHandler();

    ivm.queries = {};

    ivm.addQuery = (query) =>
    {
        this.queries[query] = {
            query: query,
            insertDiff: 'hey you got a query',
            updateDiff: 'hey you got an update',
            deleteDiff: 'hey you got a delete'
        };
    };

    ivm.sendInsertDiff = (query) =>
    {
        // console.log('here we are in send insert diff');
        socketHandler.sendQueryDiff(ivm.queries[query]);
    };

    ivm.changeInsertDiff = (query, diff) =>
    {
        ivm.queries[query].insertDiff = diff;
        ivm.sendInsertDiff(query);
    };

    ivm.changeUpdateDiff = (query, diff) =>
    {
        ivm.queries[query].updateDiff = diff;
    };

    ivm.changeDeleteDiff = (query, diff) =>
    {
        ivm.queries[query].deleteDiff = diff;
    };

    ivm.getQuery = (query) =>
    {
        return ivm.queries[query];
    }
}

module.exports = new IVM();