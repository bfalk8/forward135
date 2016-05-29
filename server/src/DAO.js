'use strict';

var pg = require('pg');

let conStr = 'postgres://postgres:test@localhost:5432/forward135';

var internalServerError = {status: 500, response: 'An error occurred'};

const DAO = {
    makeParameterizedQuery: (qry, argArray) => {
        pg.connect(conStr, function(err, client, done){

            var handleError = function(err){
                if(!err) { return false; }

                if(client){ done(client); }

                return true;
            };

            if(handleError(err)){ return internalServerError; }

            var query = client.query(qry [argArray]);

            query.on('error', function(){
                handleError(true);
                return internalServerError;
            });

            query.on('row', function(row, result){
                result.addRow(row);
            });

            /*
             result:
                - command   sql command
                - rowCount  # rows affected
                - oid       object id
                - rows      array of rows
             */
            query.on('end', function(result){
                done();
                // TODO: see above todo
                // res.writeHead(200, {'content-type': 'text/plain'});
                // res.end('You are visitor number ' + result.rows[0]);
                return {status:200, response:'success!', data: result};
            });
        });
    },

    makePreparedStatement: (queryName, queryText, queryValue) => {
        // prepare config with optional fields
        var config = {text: queryText};
        if(queryName){ config.name = queryName; }
        if(queryValue){ config.value = queryValue; }

        // console.info('[makePreparedStatement] config', config);
        pg.connect(conStr, function(err, client, done){

            var handleError = function(err){
                if(!err) { return false; }

                if(client){ done(client); }

                return true;
            };

            if(handleError(err)){
                console.error('[makePreparedStatement] err', err);
                return internalServerError;
            }

            var query = client.query(config.text, config.value);
            console.info('[makePreparedStatement] config', config);
            query.on('error', function(){
                handleError(true);
                return internalServerError;
            });

            query.on('row', function(row, result){
                console.log('[makePreparedStatement] row', row, result);
                result.addRow(row);
            });

            /*
             result:
             - command   sql command
             - rowCount  # rows affected
             - oid       object id
             - rows      array of rows
             */
            query.on('end', function(result){
                console.log('[makePreparedStatement] end', result);
                done();
                return {status:200, response: 'success!', data: result};
            });
        });

    }
};

module.exports = DAO;
