'use strict';
var pg = require('pg');

class DatabaseQuery{
    constructor(constring, query){
        pg.connect(constring, function(err, client) {
           if(err){
               console.log(err);
           } else {
               var q = client.query(query);
               q.on('row', function(row){
                   console.log('query result: ', row);
               });
               q.on('error', function () {
                   console.log('query failed to execute');
               });
           }
        });
    }
}

module.exports = DatabaseQuery;