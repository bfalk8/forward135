'use strict';

var pg = require ('pg');
var pgConString = "postgres://postgres:test@localhost:5432/forward135";

class DatabaseListener{
    constructor(){
        pg.connect(pgConString, function(err, client) {
            if(err) {
                console.log(err);
            }else{
                client.on('notification', function(msg) {
                    console.log(msg);
                });
                var query = client.query("LISTEN watchers");
            }
        });
    }
}

module.exports = DatabaseListener;