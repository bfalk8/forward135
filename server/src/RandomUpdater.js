var Q = require('q');

class Updater {

    constructor(db, maxInterval) {
        this.db          = db;
        this.maxInterval = maxInterval;
    }

    start(callBack) {
        var deferred = Q.defer();
        var count    = 0;
        var interval = setInterval(() => {
            var id = this.db.store[Math.floor(Math.random() * this.db.store.length)].id;

            this.db.update(id, {updatedAt: Date.now()}).then(callBack);

            if (++count > this.maxInterval)
            {
                clearInterval(interval);
                deferred.resolve();
            }

        }, 1000);

        return deferred.promise();

    }
}

module.exports = Updater;