
var mysql      = require('mysql');
var connection = mysql.createConnection({
              host     : 'ec2-46-137-99-175.eu-west-1.compute.amazonaws.com',
              user     : 'ywitwkxvyevnxv',
              password : 'fa37b6048a879a5f303d22cf216adc0453b0083b43cffb57795a781afa698f3d',
              database : 'd1qrkjj03t8v6f'
            });
//var connection = conn;
connection.connect();
global.db = connection;
module.exports = {
    connection: connection
};
