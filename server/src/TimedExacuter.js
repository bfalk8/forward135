'use strict';

var _ = require('_');

const TimedExecuter = {
    
    fns: [],
    count: 0,
    period: 10000,
    setPeriod: period => {
        this.period = period;
        return this;
    },
    addFunctions: fn => {
        if (typeof fn !== 'object')
        {
            throw TypeError('TimeExecuter.addFunction requires either a function or a array of functions.');
        }

        if (fn instanceof Array)
        {
            this.fns.concat(fn);
            return this;
        }

        this.fns.push(fn);
        return this;
    },
    run() {

        let fns       = this.fns;
        this.interval = setInterval(() => {
            _.invoke(fns);
        }, this.period);

        return this;
    },
    stop: () => {
        if (!this.interval)
        {
            return this;
        }

        clearInterval(this.interval);
        return this;
    },
    force: () => {
        let fns = this.fns;
        this.stop();
        _.invoke(fns);
        return this.run();
    }
};

module.exports = TimedExecuter;
