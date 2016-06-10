import Greeting from './Greeting.js';
import WebSocket from './WebSocket.js';
import Log from './Log';
import AnalyticsTable from './AnalyticsTable';

var h1 = document.querySelector('h1');
h1.textContent = new Greeting();

let socket = WebSocket.socket;

var top_k_user =
    'SELECT USR.NAME AS USER_NAME, PROD.NAME AS PRODUCT_NAME, COALESCE(SUM(O.PRICE), 0) AS CELL_SUM, ' +
    'USR.USER_SUM AS ROW_SUM, PROD.PRODUCT_SUM AS COLUMN_SUM ' +
    'FROM ( ' +
        'SELECT U.ID, U.NAME, SUM(O.PRICE) AS USER_SUM ' +
    'FROM USERS U, ORDERS O ' +
    'WHERE O.USER_ID = U.ID ' +
    'GROUP BY U.ID, U.NAME ' +
    'ORDER BY USER_SUM DESC LIMIT 20 ' +
    ') USR ' +
    'CROSS JOIN ( ' +
        'SELECT P.ID, P.NAME, SUM(O.PRICE) AS PRODUCT_SUM ' +
    'FROM PRODUCTS P, ORDERS O ' +
    'WHERE O.PRODUCT_ID = P.ID ' +
    'GROUP BY P.ID, P.NAME ' +
    'ORDER BY PRODUCT_SUM DESC LIMIT 10 ' +
    ') PROD ' +
    'LEFT JOIN ORDERS O ' +
    'ON O.USER_ID = USR.ID AND O.PRODUCT_ID = PROD.ID ' +
    'GROUP BY USR.ID, PROD.ID, USR.NAME, PROD.NAME, USR.USER_SUM, PROD.PRODUCT_SUM ' +
    'ORDER BY PROD.PRODUCT_SUM DESC, USR.USER_SUM DESC;';

var top_k_product =
    'SELECT PROD.NAME AS USER_NAME, USR.NAME AS PRODUCT_NAME, COALESCE(SUM(O.PRICE), 0) AS CELL_SUM, ' +
    'PROD.PRODUCT_SUM AS ROW_SUM, USR.USER_SUM AS COLUMN_SUM ' +
    'FROM ( ' +
    'SELECT U.ID, U.NAME, SUM(O.PRICE) AS USER_SUM ' +
    'FROM USERS U, ORDERS O ' +
    'WHERE O.USER_ID = U.ID ' +
    'GROUP BY U.ID, U.NAME ' +
    'ORDER BY USER_SUM DESC LIMIT 20 ' +
    ') USR ' +
    'CROSS JOIN ( ' +
    'SELECT P.ID, P.NAME, SUM(O.PRICE) AS PRODUCT_SUM ' +
    'FROM PRODUCTS P, ORDERS O ' +
    'WHERE O.PRODUCT_ID = P.ID ' +
    'GROUP BY P.ID, P.NAME ' +
    'ORDER BY PRODUCT_SUM DESC LIMIT 10 ' +
    ') PROD ' +
    'LEFT JOIN ORDERS O ' +
    'ON O.USER_ID = USR.ID AND O.PRODUCT_ID = PROD.ID ' +
    'GROUP BY USR.ID, PROD.ID, USR.NAME, PROD.NAME, USR.USER_SUM, PROD.PRODUCT_SUM ' +
    'ORDER BY PROD.PRODUCT_SUM DESC, USR.USER_SUM DESC;';

var simple_query = 'select * from orders ';

var topkusersTable = new AnalyticsTable('topkusers');
var topkproductsTable = new AnalyticsTable('topkproducts');

socket.emit('init query', {table: 'orders', query: top_k_user});
socket.emit('init query', {table: 'orders', query: top_k_product});
// socket.emit('init query', {table: 'orders', query: simple_query});

socket.on('init query', request => {
    console.log('Populating table');
    if(request.query === top_k_user){
        topkusersTable.populate(request.payload, 'User \\ Product');
    }
    if(request.query === top_k_product){
        topkproductsTable.populate(request.payload, 'Product \\ User');
    }
    if(request.query === simple_query){
        console.log(request);
    }
});

socket.on('error message', data => {
    console.error('OMG SOCKET ERROR: ', data)
});

var insertLog = new Log('insertLog');
socket.on('diff query', request => {
    if(request.query === top_k_user){
        topkusersTable.updateTable(request.payload);
    }
    if(request.query === top_k_product){
        topkproductsTable.updateTable(request.payload);
    }
    if(request.query === simple_query){
        console.log('DIFF INCOMING: ', request);
    }
    insertLog.appendLog(request);
});

