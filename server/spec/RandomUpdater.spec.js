'use strict';

var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

fdescribe('RandomUpdate', () => {
    var updater, mockDb, randUpdate;
    beforeEach(function(done){
        updater = new require('../');

        done();
    });

    xit('should echo input data', () => {
        handler.echo(handler.io, "test");
    });


});