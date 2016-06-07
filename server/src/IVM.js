'use strict';

let SocketHandler = require('./SocketHandler');
let DatabaseQuery = require('./DatabaseQuery');
let DAO           = require('./DAO');
let Tables        = require('./Tables');
let TimedExecuter = require('./TimedExecuter');
let _             = require('lodash');

const IVM = {
    queries: [],
    tables: {},
    viewNum: 0,
    numUpdates: 0,
    tolerance: 15,

    init: () => {
        console.log('IVM init');
        this.tables        = new Tables();
        this.socketHandler = new SocketHandler();
        this.viewNum       = 0;
        this.queries       = [];
        this.numUpdates    = 0;
        TimedExecuter.addFunctions(IVM.performMaintenance).start();
    },

    addQuery: (tName, query, callback) => {
        var materializedView           = this.viewNum++;
        // this.tables.table(tName).query = {query: query, view: `mv${materializedView}`};
        this.queries[materializedView] = {query: query, view: `mv${materializedView}`};
        DAO.makeMaterializedView(query, `mv${materializedView}`, (result)=> {
            console.log(result);
            var queryString = `select * from mv${materializedView}`;
            DAO.makeQuery(queryString, (result) => {
                this.queries[materializedView].snapshot = result.payload;
                result.query                            = query;
                callback(result);
                console.log('added query');
            });
        });
    },

    /**
     * change is the result of the watcher function, has the following format
     * change: {table: '<table that changed>', type: '<INSERT, UPDTATE, or DELETE>', id: '<id of new tuple>'}
     * @param change
     */
    tableUpdate: change => {
        TimedExecuter.incCount();
    },

    performMaintenance: () => {
        console.log('[IVM] Performing maintenance');
        this.queries.forEach((element, index) => {
            IVM.createDiff(element, index, (diff) => {
                this.socketHandler.sendQueryDiff(element.query, diff);
            });
        });
    },

    createDiff: (queryObject, index, callback) => {
        DAO.refreshMaterializedView(queryObject.view, (result) => {
            var queryString = `SELECT * FROM ${queryObject.view}`;
            DAO.makeQuery(queryString, (result) => {
                var newVersion = result.payload;
                var diff = {op: 'INSERT', query: queryObject.query, payload: []};

                newVersion.forEach((element, index) => {
                    if(!_.isEqual(_.omit(element, _.functions(element)),
                            _.omit(queryObject.snapshot[index], _.functions(queryObject.snapshot[index])))){
                        diff.payload.push({target: index, change: element});
                    }
                });

                this.queries[index].snapshot = newVersion;
                callback(diff);
            });
        });
    }
};

module.exports = IVM;
