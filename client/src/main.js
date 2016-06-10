import Greeting from './Greeting.js';
import WebSocket from './WebSocket.js';
import Log from './Log';
import AnalyticsTable from './AnalyticsTable';
import RecentOrdersTable from './RecentOrdersTable';

var h1 = document.querySelector('h1');
h1.textContent = new Greeting();

let socket = WebSocket.socket;

var topKUser =
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

var topKProduct =
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

var simple_query = 'select u.name, p.name, o.quantity, o.price';
var recentOrders = 'SELECT o.id, u.name AS user_name, p.name as product_name, o.quantity, o.price ' +
    'FROM orders o LEFT JOIN users u ON o.user_id = u.id ' +
    'LEFT JOIN products p ON o.product_id = p.id ' +
    'ORDER BY o.id DESC ' +
    'LIMIT 10;'

var topkusersTable = new AnalyticsTable('topkusers');
var topkproductsTable = new AnalyticsTable('topkproducts');
var recentOrdersTable = new RecentOrdersTable('recentOrders');

socket.emit('init query', {table: 'orders', query: topKUser});
socket.emit('init query', {table: 'orders', query: topKProduct});
socket.emit('init query', {table: 'orders', query: recentOrders});

socket.on('init query', request =>
{
    console.log('Populating table');
    if (request.query === topKUser) {
        topkusersTable.populate(request.payload, 'User \\ Product');
    }
    if (request.query === topKProduct) {
        topkproductsTable.populate(request.payload, 'Product \\ User');
    }
    if (request.query === recentOrders) {
        // console.log(request);
        recentOrdersTable.populate(request.payload);
    }
});

socket.on('error message', data =>
{
    console.error('OMG SOCKET ERROR: ', data)
});

var insertLog = new Log('diffLog');
socket.on('diff query', request =>
{
    if (request.query === topKUser) {
        topkusersTable.updateTable(request.payload);
    }
    if (request.query === topKProduct) {
        topkproductsTable.updateTable(request.payload);
    }
    if (request.query === recentOrders) {
        recentOrdersTable.updateTable(request.payload);
    }
    insertLog.appendLog(request);
});

