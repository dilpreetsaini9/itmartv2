import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "myuser",
  password: "mypassword",
  database: "your_database_name",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
