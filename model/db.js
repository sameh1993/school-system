const mssql = require("mssql")

var config = {
    user: 'sa',
    password: 'admin123456',
    server: 'localhost',
    database: 'schoolDB',
    options: {
        trustServerCertificate: true
    },
}

exports.db = (sqlStatement) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
    
            if(!err) {
                const request = new mssql.Request()
        
                request.query(sqlStatement, (error, recordSet) => {
                    if(!err) {
                        resolve(recordSet)
                    } else {
                        reject(error)
                    }
                })
            } else {
                reject(err)
            }
        })
    })
}