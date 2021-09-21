
const mssql = require("mssql")

var config = {
    user: 'sa',
    password: 'admin123456',
    server: 'localhost',
    database: 'schoolDB',
    options: {
        trustServerCertificate: true
    }
}

const db = require("../model/db").db


exports.createCommittees = () => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, error => {
            if(!error) {
                const request = new mssql.Request()

                request.query(`EXEC createCommittees`).then(resault => {
                   resolve(resault)
                })
            } else {
                console.log(error)
            }
        })
    })
}

exports.getCommitteesByLevelAndSex = (data) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config, error => {
            if(!error) {
                const request = new mssql.Request()
                request.query(`select * from committees where sex = ${data.sex} and level_id = ${data.level}`, (err, recordset) => {
                    if(!err) {
                        resolve(recordset)
                    } else {
                        reject(err)
                    }
                })
            } else {
                reject(error)
            }
        })
    })
}


exports.deleteStudentBySsn = (data) => {
    return new Promise((resolve, reject) => {
        db(`delete from committees where ssn=${data}`).then(() => {
            resolve('good')
        }).catch(err => {
            reject(err)
        })
    })
}
