'use strict';

var Q = require('q');

class RandomUpdater {

    constructor(db, maxInterval, period, ivm) {
        this.db          = db;
        this.maxInterval = maxInterval;
        this.period      = period;
    }

    start(callBack) {
        let deferred = Q.defer();
        let count    = 0;
        var interval = setInterval(() => {
            let id = this.db.store[Math.floor(Math.random() * this.db.store.length)].id;
            this.db.update(id, {updatedAt: Date.now()}).then(() => {
                // console.log('Callback called from updater');
                callBack('select *', `update count ${count++}`);
            });

            if (this.maxInterval >= 0 && ++count > this.maxInterval)
            {
                clearInterval(interval);
                return deferred.resolve({});
            }

        }, this.period);

        return deferred.promise;

    }
}

module.exports = RandomUpdater;