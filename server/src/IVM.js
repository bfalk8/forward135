'use strict';

var SocketHandler = require('./SocketHandler');
var DatabaseQuery = require('./DatabaseQuery');
var DAO = require('./DAO');
let Tables        = require('./Tables');


const IVM = {
    queries: {},
    tables: {},
    viewNum: 0,
    numUpdates: 0,
    tolerance: 15,

    init: () => {
        this.tables = new Tables();
        this.socketHandler = new SocketHandler();
        this.viewNum = 0;
    },

    addQuery: (tName, query) => {
        this.tables.table(tName).query = {query: query, view: `mv${++this.viewNum}`};
        DAO.makeMaterializedView(query,`mv${this.viewNum}` );
        console.log('added query');
    },

    /**
     * change is the result of the watcher function, has the following format
     * change: {table: '<table that changed>', type: '<INSERT, UPDTATE, or DELETE>', id: '<id of new tuple>'}
     * @param change
     */
    tableUpdate: change => {
        if(++this.numUpdates >= 6){
            var queries = this.tables.table(change.table).queries;
            if (queries.length < 1) {
                return;
            }
            queries.forEach( element => {
                DAO.refreshMaterializedView(element.view);
                // DAO.makeParameterizedQuery(element.query);
                this.socketHandler.sendQueryDiff(element, change);
            });
        }
    }
};

module.exports = IVM;
