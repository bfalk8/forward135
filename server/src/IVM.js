'use strict';

let instance = null;

class IVM {
    constructor(){
        // check for singleton pattern
        if(!instance) {
            instance = this;
        }
        this.queries = {};
        
        // returns singleton
        return instance;
    }

    addQuery(query) {
        this.queries[query] = {
            insertDiff: 'hey you got a query',
            updateDiff: 'hey you got an update',
            deleteDiff: 'hey you got a delete' };
    }

    changeInsertDiff(query, diff) {
        this.queries[query].insertDiff = diff;
    }

    changeUpdateDiff(query, diff) {
        this.queries[query].updateDiff = diff;
    }

    changeDeleteDiff(query, diff) {
        this.queries[query].deleteDiff = diff;
    }

    getQuery(query) {
        return this.queries[query];
    }
}

module.exports = IVM;