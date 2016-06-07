'use strict';

var pg = require('pg');
var config = require('../../config.json');

let internalServerError = {status: 500, response: 'An error occurred'};
let conStr = config.connectionString;
const DAO = {
    makeParameterizedQuery: (qry, argArray) => {
        pg.connect(conStr, (err, client, done)=>{

            var handleError = (err)=>{
                if(!err) { return false; }

                if(client){ done(client); }

                return true;
            };

            if(handleError(err)){ return internalServerError; }

            var query = client.query(qry, argArray);

            query.on('error', ()=>{
                handleError(true);
                return internalServerError;
            });

            query.on('row', (row, result)=>{
                result.addRow(row);
            });

            /*
             result:
                - command   sql command
                - rowCount  # rows affected
                - oid       object id
                - rows      array of rows
             */
            query.on('end', (result)=>{
                done();
                // TODO: see above todo
                // res.writeHead(200, {'content-type': 'text/plain'});
                // res.end('You are visitor number ' + result.rows[0]);
                return result;
            });
        });
    },

    makeMaterializedView: (queryName, matName, callback) => {
        pg.connect(conStr, (err, client, done) => {
            var materialized = `DROP MATERIALIZED VIEW IF EXISTS ${matName}; CREATE MATERIALIZED VIEW ${matName} AS ${queryName}`;

            var query = client.query(materialized);

            query.on('error', (err)=>{
                console.error(err);
                return internalServerError;
            });

            query.on('row', (row, result)=>{
                result.addRow(row);
            });

            /*
             result:
             - command   sql command
             - rowCount  # rows affected
             - oid       object id
             - rows      array of rows
             */
            query.on('end', (result)=>{
                done();
                callback(result);
                // return {status:200, response:'success!', data: result};
            });

        })
    },

    refreshMaterializedView: (viewName, callback) => {
        pg.connect(conStr, (err, client, done) => {
            var materialized = `REFRESH MATERIALIZED VIEW ${viewName}`;
            var query = client.query(materialized);

            query.on('error', (err)=>{
                console.error(err);
                return internalServerError;
            });

            query.on('row', (row, result)=>{
                result.addRow(row);
            });

            /*
             result:
             - command   sql command
             - rowCount  # rows affected
             - oid       object id
             - rows      array of rows
             */
            query.on('end', (result)=>{
                done();
                callback(result);
            });

        })
    },

    makeQuery: (queryName, callback) => {
        pg.connect(conStr, (err, client, done) => {
            var query = client.query(queryName);

            query.on('error', (err)=>{
                console.error(err);
                return internalServerError;
            });

            query.on('row', (row, result)=>{
                result.addRow(row);
            });

            /*
             result:
             - command   sql command
             - rowCount  # rows affected
             - oid       object id
             - rows      array of rows
             */
            query.on('end', (result)=>{
                done();
                var queryResult = {
                    payload: result.rows
                };
                callback(queryResult);
            });

        })
    },
    
    makePreparedStatement: (queryName, queryText, queryValue) => {
        // prepare config with optional fields
        var config = {text: queryText};
        if(queryName){ config.name = queryName; }
        if(queryValue){ config.values = queryValue; }

        // console.info('[makePreparedStatement] config', config);
        pg.connect(conStr, (err, client, done)=>{

            var handleError = (err)=>{
                if(!err) { return false; }

                if(client){ done(client); }

                return true;
            };

            if(handleError(err)){
                // console.error('[makePreparedStatement] err', err);
                return internalServerError;
            }

            var query = client.query(config);

            query.on('error', ()=>{
                handleError(true);
                return internalServerError;
            });

            query.on('row', (row, result)=>{
                result.addRow(row);
            });

            /*
             result:
             - command   sql command
             - rowCount  # rows affected
             - oid       object id
             - rows      array of rows
             */
            query.on('end', (result)=>{
                // console.log('[makePreparedStatement] end', result);
                done();
                return {status:200, response: 'success!', data: result};
            });

            done();
        });

    }
};

module.exports = DAO;
