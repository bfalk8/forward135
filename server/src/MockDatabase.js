'use strict';

var _ = require('lodash');
var Q = require('q');

class MockDatabase {

    constructor(size) {
        this.store = [];
        this.loadDb(size);
    }

    loadDb(size) {
        for (var i = 0; i < size; i++)
        {
            var obj = {
                id: i,
                name: 'test_obj_' + i,
                updateCount: 0,
                timestamp: Date.now()
            };
            this.store.push(obj);
        }
    }

    update(id, delta) {
        var obj = _.find(this.store, (o) => o.id === id);
        _.merge(obj, delta);
        return Q.when(obj);
    }

    add(obj) {
        this.store.push(obj);
        return Q.when(obj);
    }

}

module.exports = MockDatabase;
