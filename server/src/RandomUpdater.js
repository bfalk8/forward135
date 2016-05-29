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
            
            dao.makePreparedStatement('randomInsert', insert, [Math.floor(Math.random()), Math.random().toFixed(2)]);
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
