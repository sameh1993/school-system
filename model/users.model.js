
const mssql = require("./db")

mssql.db.connect(mssql.config).then(pool => {
    console.log(pool)
    // if (pool.connected) {
    //   mssql.db.query("select * from students").then(resault => {
    //     console.log(resault)
    //   })
    // }
})