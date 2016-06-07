'use strict';

var SocketHandler = require('./SocketHandler');
var DatabaseQuery = require('./DatabaseQuery');
var DAO = require('./DAO');
let Tables        = require('./Tables');


const IVM = {
    queries: [],
    tables: {},
    viewNum: 0,
    numUpdates: 0,
    tolerance: 15,

    init: () => {
        this.tables = new Tables();
        this.socketHandler = new SocketHandler();
        this.viewNum = 0;
        this.queries = [];
        this.numUpdates = 0;
    },

    addQuery: (tName, query, callback) => {
        var materializedView = this.viewNum++;
        // this.tables.table(tName).query = {query: query, view: `mv${materializedView}`};
        this.queries[materializedView] = {query: query, view: `mv${materializedView}`};
        DAO.makeMaterializedView(query,`mv${materializedView}`, (result)=>{
            console.log(result);
            var queryString = `select * from mv${materializedView}`;
            DAO.makeQuery(queryString, (result) => {
                this.queries[materializedView].snapshot = result.payload;
                result.query = query;
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
        // if(++this.numUpdates >= 6){
        //     var queries = this.tables.table(change.table).queries;
        //     if (queries.length < 1) {
        //         return;
        //     }
        //     queries.forEach( element => {
        //         DAO.refreshMaterializedView(element.view);
        //         // DAO.makeParameterizedQuery(element.query);
        //         this.socketHandler.sendQueryDiff(element.query, change);
        //     });
        // }
        console.log(this.numUpdates);
        if(++this.numUpdates == 3){
            IVM.performMaintenance();
        }
    },

    performMaintenance: () => {
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
                // RUN DIFF CODE HERE
                // For now sending entire query back as diffs
                newVersion.forEach((element, index) => {
                    diff.payload.push({target: index, change: element});
                });
                callback(diff);
            });
        });
    }
};

module.exports = IVM;
