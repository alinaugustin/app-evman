
var mysql      = require('mysql');
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'newuser',
              password : 'testpass',
              database : 'app1'
            });
//var connection = conn;
connection.connect();
global.db = connection;
module.exports = {
    connection: connection
};
