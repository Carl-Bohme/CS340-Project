var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_bohmec",
    password: "ZxQGXEBsPG13wuEX",
    database: "cs340_bohmec"
  });
  module.exports.pool = pool;