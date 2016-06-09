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
'ORDER BY PROD.PRODUCT_SUM DESC;'

var simple_query = 'select * from orders ';


socket.emit('init query', {table: 'orders', query: top_k_user});

var analyticsTable = new AnalyticsTable('analytics');

socket.on('init query', request => {
    console.log('Populating table');
    analyticsTable.populate(request.data.payload, 'User \\ Product'); // TODO: remove .data.
});

var insertLog = new Log('insertLog');
socket.on('diff query', request => {
    analyticsTable.updateTable(request.payload);
    insertLog.appendLog(request);
});

