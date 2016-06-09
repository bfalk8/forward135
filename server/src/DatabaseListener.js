'use strict';

var pg  = require('pg');
var ivm = require('./IVM');


const DatabaseListener = {
    init: (dbString) => {
        pg.connect(dbString, function (err, client) {
            if (err)
            {
                let error = new Error('Could not create connection.', 'DatabaseListener');
                error.stack += err.stack;
                throw error;
            }

            client.on('notification', function (msg) {
                console.log(msg);
                if (msg.channel === 'watchers')
                {
                    ivm.tableUpdate(msg);
                }
            });

            // needs to be here to start listening to 'watchers' channel
            client.query("LISTEN watchers");
        });
    }
};

module.exports = DatabaseListener;