
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

// connect to get id and class level

exports.getAllClasses = () => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, err => {
            if(!err) {
                const request = new mssql.Request()

                request.query(`select * from classes`, (error, recordset) => {
                    if(!error) {
                        resolve(recordset)
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