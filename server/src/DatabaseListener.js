'use strict';

var pg = require('pg');
var ivm = require('./IVM');
var pgConString = "postgres://postgres:test@localhost:5432/forward135";

class DatabaseListener{
    constructor(dbString){
        pg.connect(dbString, function(err, client) {
            if(err) {
                console.log(err);
            }else{
                client.on('notification', function(msg) {
                    console.log(msg);
                    if(msg.channel === 'watchers'){
                        var payload = msg.payload.split(',');
                        var updateInfo = {};
                        updateInfo.table = payload[0];
                        updateInfo.column = payload[1];
                        updateInfo.id = payload[2];
                        ivm.tableUpdate(updateInfo);
                    }
                });
                // needs to be here to start listening to 'watchers' channel
                var query = client.query("LISTEN watchers");
            }
        });
    }
}

module.exports = DatabaseListener;