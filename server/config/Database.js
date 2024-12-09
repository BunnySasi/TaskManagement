import mysql from "mysql";

//Create mySQL connection
const db = mysql.createConnection({ host: "host.docker.internal", user: "root", password: "**************", port: "3306", database: "nodelogin" });
db.connect(err => {
  if (err) throw err;
  console.log("[SUCCESS] MYSQL DB ready");
});

export default db;
