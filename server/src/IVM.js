'use strict';

let SocketHandler = require('./SocketHandler');
let DatabaseQuery = require('./DatabaseQuery');
let DAO           = require('./DAO');
let TimedExecuter = require('./TimedExecuter');
let _             = require('lodash');

const IVM = {
    queries: [],
    viewNum: 0,
    numUpdates: 0,

    init: () => {
        console.log('IVM init');
        this.socketHandler = new SocketHandler();
        this.viewNum       = 0;
        this.queries       = [];
        this.numUpdates    = 0;
        TimedExecuter.addFunctions(IVM.performMaintenance).start();
    },

    addQuery: (tName, query, callback) => {
        var materializedView = this.viewNum++;
        DAO.makeMaterializedView(query, `mv${materializedView}`, (result, err)=> {
            if(err){
                console.error(err);
                callback(null, err);
                return;
            }
            var queryString = `select * from mv${materializedView}`;
            DAO.makeQuery(queryString, (result, err) => {
                if(err){
                    console.error(err);
                    callback(null, err);
                    return;
                }
                this.queries[materializedView] = {query: query, view: `mv${materializedView}`, snapshot: result.payload};
                result.query = query;
                console.log(`added query: ${query} with materialized view mv${materializedView}`);
                callback(result);
            });
        });
    },

    // Returns query object for passed in query
    getQuery: query => {
        return this.queries.find(entry => {
            return entry.query === query;
        });
    },

    // Returns current snapshot for query
    getSnapshot: query => {
        return this.queries.find(entry => {
            return entry.query === query;
        }).snapshot;
    },

    // Gets called from the DatabaseListener on each trigger
    tableUpdate: change => {
        TimedExecuter.incCount();
    },

    performMaintenance: () => {
        console.log('[IVM] Performing maintenance');
        this.queries.forEach((element, index) => {
            IVM.createDiff(element, index, (diff) => {
                if(diff.payload.length > 0){
                    this.socketHandler.sendQueryDiff(element.query, diff);
                }
            });
        });
    },

    createDiff: (queryObject, index, callback) => {
        DAO.refreshMaterializedView(queryObject.view, (result, err) => {
            if(err){
                console.error(err);
                return;
            }
            var queryString = `SELECT * FROM ${queryObject.view}`;
            DAO.makeQuery(queryString, (result, err) => {
                if(err){
                    console.error(err);
                    return;
                }
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
