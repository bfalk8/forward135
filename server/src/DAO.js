'use strict';

var pg = require('pg');
// var express = require('express');
// var subApp = express();
let conString = 'jdbc:postgresql://localhost:5432/postgres';

let instance = null;

let internalServerError = {status: 500, response: 'An error occurred'};

class DAO {
    constructor(){
        // check for singleton pattern
        if(!instance) {
            instance = this;
        }

        // return singleton
        return instance;
    }

    makeParameterizedQuery(qry, argArray) {
        pg.connect(conString, function(err, client, done){

            var handleError = function(err){
                if(!err) { return false; }

                if(client){ done(client); }

                // TODO: determine how this class interacts with the server
                // res.writeHead(500, {'content-type': 'text/plain'});
                // res.end('An error occurred');

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
                return {status:200, response: result};
            });
        });
    }

    makePreparedStatement(queryText, queryName, queryValue){

        // prepare config with optional fields
        var config = {text: queryText};
        if(queryName){ config.name = queryName; }
        if(queryValue){ config.value = queryValue; }

        pg.connect(conString, function(err, client, done){

            var handleError = function(err){
                if(!err) { return false; }

                if(client){ done(client); }
                
                return true;
            };

            if(handleError(err)){ return internalServerError; }

            var query = client.query(config);

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
                return {status:200, response: result};
            });
        });

    }

    createWatcher(event, callback){
        pg.connect(conString, function(err, client){
            // TODO: determine how to handle errors for watchers
            if(err){
                console.log(err);
            }

            client.on('notification', function(msg){
                callback(msg);
                // console.log(msg);
            });

            var query = client.query('LISTEN watch_' + event);
        });
    }

}



module.exports = DAO;