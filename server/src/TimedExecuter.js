'use strict';

let timedExec = {
    fns: [],
    count: 0,
    countThreshold: 10,
    period: 10000
};

function invoke(fns) {
    try
    {
        fns.forEach((fn)=> fn());
    }
    catch (err)
    {
        console.error(err)
    }
}

timedExec.setPeriod = period => {
    timedExec.period = period;
    return timedExec;
};

timedExec.incCount = () => {
    timedExec.count = ++timedExec.count % timedExec.countThreshold;
    if (timedExec.count === 0) {
        console.log('[IVM] Insert count meets threshold.');
        timedExec.force();
    }
};

timedExec.addFunctions = fn => {
    let fnType = typeof fn;
    if (fnType !== 'function' && typeof fn !== 'object')
    {
        throw TypeError('TimeExecuter.addFunction requires either a function or a array of functions.');
    }

    if (fn instanceof Array)
    {
        timedExec.fns = timedExec.fns.concat(fn);
        return timedExec;
    }

    timedExec.fns.push(fn);
    return timedExec;
};

timedExec.start = () => {
    let fns            = timedExec.fns;
    timedExec.interval = setInterval(() => invoke(fns), timedExec.period);
    return timedExec;
};

timedExec.stop = () => {
    if (!timedExec.interval)
    {
        return timedExec;
    }

    clearInterval(timedExec.interval);
    return timedExec;
};

timedExec.force = () => {
    let fns = timedExec.fns;
    timedExec.stop();
    invoke(fns);
    return timedExec.start();
};

module.exports = timedExec;
