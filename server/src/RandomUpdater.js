'use strict';

var Q = require('q');
var dao = require('./DAO');
const insert = 'INSERT INTO orders (user_id, product_id, quantity, price, is_cart) VALUES ($1, $2, $3, $4, FALSE)';

// const userIds = [1, 2, 6, 9, 12, 15, 20, 21, 36, 40, 47, 50, 55, 59, 60, 61, 75, 89, 92, 97];
// const productIds = [1, 52, 59, 14, 72, 82, 78, 34, 66, 87];

class RandomUpdater {

    constructor(maxInterval, periodMin, periodMax) {
        this.maxInterval = maxInterval;
        this.periodMin = periodMin;
        this.periodMax = periodMax || periodMin;
    }

    start() {
        let deferred = Q.defer();
        let count    = 0;
        var interval = setInterval(() => {
            // TODO: randFromSet --> randi: more general, less dependent on specific pygenerated data
            // [this.randFromSet(userIds), this.randFromSet(productIds),
            var insertValue = [this.randi(0,100), this.randi(0,100),
                this.randi(0, 101), parseFloat(this.randi(0, 101).toFixed(2))];
            dao.makeParameterizedQuery(insert, insertValue);
            console.log(`Updater ${insertValue}`);
            if (this.maxInterval >= 0 && ++count > this.maxInterval)
            {
                clearInterval(interval);
                return deferred.resolve({});
            }

        }, this.randi(this.periodMin, this.periodMax));

        return deferred.promise;

    }

    randi(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }

    randFromSet(range){
        return range[this.randi(0, range.length)];
    }
}

module.exports = RandomUpdater;
