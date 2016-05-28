'use strict';

var chai   = require('chai'),
    mocha  = require('mocha'),
    expect = chai.expect,
    should = chai.should();

describe('RandomUpdate', () => {
    let db, RandomUpdater;

    before(done => {
        let MockDatabase  = require('../src/MockDatabase');
        RandomUpdater = require('../src/RandomUpdater');

        db = new MockDatabase(30);

        done();
    });

    it('should have 30 entries in db', () => {
        expect(db.store.length).to.equal(30);
    });

    it('should call the call back function 10 times before it returns', done => {
        let randUpdate  = new RandomUpdater(db, 10, 0); // Timeout set to 0 so we don't have to wait
        let count       = 0;
        let callCounter = () => {
            count++;
        };

        let promise = randUpdate.start(callCounter);

        promise.then(() => {
            expect(count).to.equal(10);
            done();
        }).catch(done); // Needed for when it fails
    });

});