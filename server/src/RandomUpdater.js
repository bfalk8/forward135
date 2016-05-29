'use strict';

var Q = require('q');
var dao = require('./DAO');
const insert = 'INSERT INTO orders (user_id, product_id, quantity, price, is_cart) VALUES (1, 1, $1, $2, FALSE)';

class RandomUpdater {

    constructor(maxInterval, period) {
        this.maxInterval = maxInterval;
        this.period      = period;
    }

    start() {
        let deferred = Q.defer();
        let count    = 0;
        var interval = setInterval(() => {
            var insertValue = [Math.floor(Math.random() * 100), parseFloat((Math.random() * 100).toFixed(2))];
            console.log('Insert values', insertValue);
            dao.makePreparedStatement('randomInsert', insert, insertValue);
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
