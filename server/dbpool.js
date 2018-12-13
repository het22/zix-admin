const mysql = require('mysql2/promise');
var dbconfig = {
  host: 'localhost',
  user: 'root',
  password: '111111',
  database: 'zix',
  dateStrings: true
};
var dbpool = mysql.createPool(dbconfig);

exports.fetch = async (query) => {
  // try database connection
  try {
    const connection = await dbpool.getConnection(async conn => conn);
    // try query
    try {
      const res = await connection.query(query);
      connection.release();
      // check query result
      if (res[0].length == 0) {
        console.log('db: query result is empty.');
        return false;
      } else {
        console.log('db: query result is returned.');
        return res[0];
      }
    } catch (err) {
      console.log('db: query error(' + err + ')');
      return false;
    }
  } catch (err) {
    console.log('db: connection error(' + err + ')');
    return false;
  }
}
